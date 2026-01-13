import React, { useEffect, useRef, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from '@react-native-vector-icons/ionicons';
import Navigate from '../../../assets/icons/navigate';
import { COLOR } from '../../../utils/color';
import { button, fontSize, spacing } from '../../../utils/scaling';
import { WEIGHT } from '../../../utils/weight';
import { useDispatch, useSelector } from 'react-redux';
import { setBids } from '../../../store/actions';
import Call from '../../../assets/icons/call.svg';
import Message from '../../../assets/icons/message.svg';
import { ENDPOINT } from '../../../utils/urls';
import ReasonModal from '../../components/Modals/ReasonModal/ReasonModal';
import ReviewDetailsModal from '../../components/Modals/ReviewDetails/ReviewDetailsModal';
import { useCompleteRide } from '../../../api/useCompleteRide';

const GOOGLE_API_KEY = 'AIzaSyB7cmDikW75oI2AiA5b1qDyQUoxcq3XtOs';
const { height, width } = Dimensions.get('window');

const MapViewRequest = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [reasonModal, setReasonModal] = useState(false);
  const [rideStep, setRideStep] = useState(0);
  const TOKEN = useSelector(state => state?.token);
  const BIDS = useSelector(state => state?.bids);
  const PROFILE = useSelector(state => state?.user);
  const socketRef = useRef(null);
  const mapRef = useRef(null);
  const watchId = useRef(null);
  const [directionsReady, setDirectionsReady] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const item = route?.params?.bidDetails;
  const { completeRide, loading, error } = useCompleteRide();
  const pickup = route?.params?.bidDetails?.data?.pickup;
  const dropoff = route?.params?.bidDetails?.data?.dropoff;

  const fallbackRegion = pickup
    ? {
        latitude: pickup.latitude,
        longitude: pickup.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 26.8607,
        longitude: 67.0011,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  const [origin, setOrigin] = useState();
  const animatedOrigin = useRef(
    new AnimatedRegion({
      latitude: fallbackRegion.latitude,
      longitude: fallbackRegion.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
  ).current;

  const [routeOrigin, setRouteOrigin] = useState(origin);
  const [directionsOrigin, setDirectionsOrigin] = useState(fallbackRegion);
  const [heading, setHeading] = useState(0);
  const prevCoords = useRef({
    latitude: fallbackRegion.latitude,
    longitude: fallbackRegion.longitude,
  });

  const handleRideButtonPress = () => {
    if (rideStep === 0) {
      driverHere();
      setRideStep(1);
    } else if (rideStep === 1) {
      rideStarted();
      setRideStep(2);
    } else {
      completeJob();
    }
  };
  const completeJob = async () => {
    await completeRide(TOKEN, {
      jobId: route?.params?.bidDetails?.data?.jobId,
      customerId: route?.params?.bidDetails?.data?.customer?.Id,
      isCompleted: true,
    }).then(result => {
      if (result?.success) {
        setShowReview(true);
        finishJob();
        dispatch(setBids([]))
      }
    });
  };
  const getRideButtonLabel = () => {
    if (rideStep === 0) return 'I am Here';
    if (rideStep === 1) return 'Ride Started';
    return 'Finish Job';
  };

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Update directions origin on rideStep change
  useEffect(() => {
    if (rideStep === 0 && pickup) {
      setDirectionsOrigin(origin || fallbackRegion);
    } else if (rideStep === 1 && dropoff) {
      setDirectionsOrigin(pickup);
    }
  }, [rideStep, origin, pickup, dropoff]);

  // Track location and heading
  useEffect(() => {
    const startTracking = async () => {
      const allowed = await requestPermission();
      if (!allowed) return;

      await Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setOrigin({ latitude, longitude });
          animatedOrigin.setValue({ latitude, longitude });
          setRouteOrigin({ latitude, longitude });
          prevCoords.current = { latitude, longitude };
        },
        err => console.log('Initial position error', err),
        { enableHighAccuracy: true },
      );

      watchId.current = Geolocation.watchPosition(
        pos => {
          const { latitude, longitude } = pos.coords;

          // Calculate heading
          const x = longitude - prevCoords.current.longitude;
          const y = latitude - prevCoords.current.latitude;
          const angle = Math.atan2(y, x) * (180 / Math.PI);
          setHeading(angle);
          prevCoords.current = { latitude, longitude };

          // Animate marker
          setOrigin({ latitude, longitude });
          animatedOrigin
            .timing({
              latitude,
              longitude,
              duration: 500,
              useNativeDriver: false,
            })
            .start();
        },
        err => console.log('Watch position error', err),
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 1000,
          fastestInterval: 500,
        },
      );
    };

    startTracking();

    return () => {
      if (watchId.current !== null) Geolocation.clearWatch(watchId.current);
    };
  }, []);

  const handleRecenter = () => {
    if (mapRef.current && origin) {
      mapRef.current.animateCamera(
        { center: origin, zoom: 17, pitch: 45 },
        { duration: 500 },
      );
    }
  };

  function timeAgo(timestamp) {
    const past = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - past) / (1000 * 60));
    if (diffMinutes <= 0) return 'Just Now';
    if (diffMinutes === 1) return '1 m';
    return `${diffMinutes} m`;
  }

  function calculateDistanceKm(pickupLat, pickupLon, dropOffLat, dropOffLon) {
    const R = 6371;
    const toRad = value => (value * Math.PI) / 180;
    const dLat = toRad(dropOffLat - pickupLat);
    const dLon = toRad(dropOffLon - pickupLon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(pickupLat)) *
        Math.cos(toRad(dropOffLat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
  }

  let wsWatchId = null;
  let socket = null;
  socketRef.current = socket;
  const driverHere = async () => {
    console.log('Hitted:::::::::::::::::::::::::::::');
    socket = new WebSocket(
      `ws://${ENDPOINT}/api/WebSocket/ConnectWebhook/${PROFILE.id}?token=${TOKEN}`,
    );
    socketRef.current = socket;
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: 'I_AM_HERE',
          jobId: item?.data?.jobId,
          userId: item?.data?.customer?.Id,
        }),
      );
    };
    socket.onclose = () => console.log('WebSocket closed');
    socket.onerror = e => console.log('WebSocket error', e);
  };
  const rideStarted = async () => {
    console.log('Hitted:::::::::::::::::::::::::::::');
    socket = new WebSocket(
      `ws://${ENDPOINT}/api/WebSocket/ConnectWebhook/${PROFILE.id}?token=${TOKEN}`,
    );
    socketRef.current = socket;
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: 'RIDE_STARTED',
          jobId: item?.data?.jobId,
          userId: item?.data?.customer?.Id,
        }),
      );
    };
    socket.onclose = () => console.log('WebSocket closed');
    socket.onerror = e => console.log('WebSocket error', e);
  };
  const finishJob = async () => {
    console.log('Hitted:::::::::::::::::::::::::::::');
    socket = new WebSocket(
      `ws://${ENDPOINT}/api/WebSocket/ConnectWebhook/${PROFILE.id}?token=${TOKEN}`,
    );
    socketRef.current = socket;
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: 'JOB_FINISHED',
          jobId: item?.data?.jobId,
          userId: item?.data?.customer?.Id,
          driverId:PROFILE?.id
        }),
      );
    };
    socket.onclose = () => console.log('WebSocket closed');
    socket.onerror = e => console.log('WebSocket error', e);
  };
  // WebSocket to send location updates
  useEffect(() => {
    const connectWebSocket = async () => {
      const granted = await requestPermission();
      if (!granted) return;
      socket = new WebSocket(
        `ws://${ENDPOINT}/api/WebSocket/ConnectWebhook/${PROFILE.id}?token=${TOKEN}`,
      );
      socketRef.current = socket;
      socket.onopen = () => {
        wsWatchId = Geolocation.watchPosition(
          position => {
            if (socket?.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  type: 'LOCATION_UPDATE',
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  speed: position.coords.speed,
                  timestamp: Date.now(),
                }),
              );
            }
          },
          error => console.log('Location error:', error),
          {
            enableHighAccuracy: true,
            distanceFilter: 10,
            interval: 15000,
            fastestInterval: 10000,
          },
        );
      };

      socket.onmessage = event => {
        const message = JSON.parse(event.data);
        console.log('HI I am CANCEL', message);
        if (message.type === 'RIDE_CANCELLED_BY_CUSTOMER') {
          dispatch(setBids([]));
          navigation.navigate('HomeStack');
        }
      };

      socket.onclose = () => console.log('WebSocket closed');
      socket.onerror = e => console.log('WebSocket error', e);
    };

    connectWebSocket();

    return () => {
      if (wsWatchId !== null) Geolocation.clearWatch(wsWatchId);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (BIDS?.type == 'RIDE_CANCELLED_BY_CUSTOMER') {
      dispatch(setBids([]));
      navigation.goBack();
    }
    if (BIDS?.type == 'RIDE_REQUEST_CANCELLED') {
      dispatch(setBids([]));
      navigation?.goBack();
    }
  }, [BIDS]);
  console.log('THESE ARE BIDS', '::::::::', BIDS);
  const hasStops = item?.data?.stops && item.data.stops.length > 0;
  const stopsCount = item?.data?.stops?.length || 0;
  const totalStops = stopsCount + 2; // pickup + stops + dropoff
  console.log('HIIIIII', item);
  return (
    <>
      <ReviewDetailsModal
      setShowReview={setShowReview}
        showReview={showReview}
        details={item}
        navigation={navigation}
      ></ReviewDetailsModal>
      <ReasonModal
        navigation={navigation}
        item={item}
        setReasonModal={setReasonModal}
        reasonModal={reasonModal}
      ></ReasonModal>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={fallbackRegion}
            showsUserLocation={false}
            scrollEnabled
            zoomEnabled
            rotateEnabled
            pitchEnabled
          >
            {directionsOrigin && pickup && rideStep === 0 && (
              <>
                <MapViewDirections
                  origin={directionsOrigin}
                  destination={pickup}
                  apikey={GOOGLE_API_KEY}
                  strokeWidth={5}
                  strokeColor={COLOR.blue}
                  lineCap="round"
                  lineJoin="round"
                  precision="high"
                  mode="DRIVING"
                  onReady={result => {
                    if (!directionsReady) {
                      mapRef.current?.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          top: 80,
                          right: 80,
                          bottom: 80,
                          left: 80,
                        },
                        animated: true,
                      });
                      setDirectionsReady(true);
                    }
                  }}
                />
                <Marker.Animated
                  coordinate={animatedOrigin}
                  rotation={heading}
                  flat
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <Navigate />
                </Marker.Animated>
                <Marker coordinate={pickup} anchor={{ x: 0.5, y: 0.5 }}>
                  <Ionicons
                    name="stop-circle"
                    size={height * 0.04}
                    color={COLOR.black}
                  />
                </Marker>
              </>
            )}

            {directionsOrigin && dropoff && rideStep === 1 && (
              <>
                {hasStops ? (
                  // 🟢 MULTI-STOP ROUTE
                  (() => {
                    const routePoints = [
                      origin,
                      ...item.data.stops.map(stop => ({
                        latitude: stop.Latitude,
                        longitude: stop.Longitude,
                      })),
                      dropoff,
                    ];

                    return routePoints.map((point, index) => {
                      if (index === routePoints.length - 1) return null;

                      return (
                        <MapViewDirections
                          key={`route-${index}`}
                          origin={routePoints[index]}
                          destination={routePoints[index + 1]}
                          apikey={GOOGLE_API_KEY}
                          strokeWidth={5}
                          strokeColor={COLOR.blue}
                          mode="DRIVING"
                          lineCap="round"
                          lineJoin="round"
                          precision="high"
                          onReady={result => {
                            if (!directionsReady && index === 0) {
                              mapRef.current?.fitToCoordinates(
                                result.coordinates,
                                {
                                  edgePadding: {
                                    top: 80,
                                    right: 80,
                                    bottom: 80,
                                    left: 80,
                                  },
                                  animated: true,
                                },
                              );
                              setDirectionsReady(true);
                            }
                          }}
                        />
                      );
                    });
                  })()
                ) : (
                  // 🔵 NO STOPS → DIRECT ROUTE
                  <MapViewDirections
                    origin={origin}
                    destination={dropoff}
                    apikey={GOOGLE_API_KEY}
                    strokeWidth={5}
                    strokeColor={COLOR.blue}
                    mode="DRIVING"
                    lineCap="round"
                    lineJoin="round"
                    precision="high"
                    onReady={result => {
                      if (!directionsReady) {
                        mapRef.current?.fitToCoordinates(result.coordinates, {
                          edgePadding: {
                            top: 80,
                            right: 80,
                            bottom: 80,
                            left: 80,
                          },
                          animated: true,
                        });
                        setDirectionsReady(true);
                      }
                    }}
                  />
                )}

                {/* 🚗 Moving Marker */}
                <Marker.Animated
                  coordinate={animatedOrigin}
                  rotation={heading}
                  flat
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <Navigate />
                </Marker.Animated>

                {/* 🛑 Stop Markers */}
                {hasStops &&
                  item.data.stops.map((stop, index) => (
                    <Marker
                      key={`stop-${index}`}
                      coordinate={{
                        latitude: stop.Latitude,
                        longitude: stop.Longitude,
                      }}
                      anchor={{ x: 0.5, y: 0.5 }}
                    >
                      <Ionicons
                        name="stop-circle"
                        size={height * 0.04}
                        color={COLOR.black}
                      />
                    </Marker>
                  ))}

                {/* 🏁 Dropoff Marker */}
                <Marker coordinate={dropoff} anchor={{ x: 0.5, y: 0.5 }}>
                  <Ionicons
                    name="flag"
                    size={height * 0.04}
                    color={COLOR.blue}
                  />
                </Marker>
              </>
            )}
          </MapView>
        </View>

        {/* Map Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={handleRecenter}>
            <Ionicons
              name="navigate-circle"
              size={height * 0.05}
              color={COLOR.blue}
            />
          </TouchableOpacity>
        </View>

        {/* Ride Info and Buttons */}
        <View
          style={{
            backgroundColor: COLOR.fadeWhite,
            width: '100%',
            bottom: 0,
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              paddingHorizontal: spacing?.wp15,
              paddingVertical: spacing?.hp15,
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: width * 0.02,
                }}
              >
                <View
                  style={{
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View>
                    <Image
                      style={{
                        height: height * 0.045,
                        borderRadius: height * 0.045,
                        width: height * 0.045,
                      }}
                      source={{ uri: item?.data?.customer?.image }}
                    ></Image>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSize.font14,
                        color: COLOR.black,
                        fontWeight: WEIGHT.semi,
                      }}
                    >
                      {item?.data?.customer?.name}{' '}
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      {/* {Array?.from(item?.data?.customer?.rating).map(() => {
                                    return <RatingStar></RatingStar>;
                                  })} */}
                      <Text
                        style={{
                          fontSize: fontSize.font11,
                          fontWeight: WEIGHT.semi,
                          color: COLOR.black,
                        }}
                      >
                        {item?.data?.customer?.rating} (289)
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSize.font11,
                          fontWeight: WEIGHT.semi,
                          color: COLOR.grey,
                        }}
                      >
                        {timeAgo(item?.timestamp)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: width * 0.02,
                  width: '85%',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingHorizontal: spacing?.wp15,
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing?.wp15,
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: spacing?.hp6,
                    }}
                  >
                    {[...Array(totalStops)].map((_, index) => {
                      const isFirst = index === 0;
                      const isLast = index === totalStops - 1;

                      return (
                        <View key={index} style={{ alignItems: 'center' }}>
                          {/* TOP DOTS (hide for first item) */}
                          {index !== 0 && (
                            <View style={{ alignItems: 'center' }}>
                              <Text style={{ fontSize: 5 }}>•</Text>
                              <Text style={{ fontSize: 5 }}>•</Text>
                            </View>
                          )}

                          {/* STOP INDICATOR */}
                          <View
                            style={{
                              width: Dimensions.get('window').width * 0.035,
                              height: Dimensions.get('window').height * 0.015,
                              borderWidth: 4,
                              borderColor: isFirst
                                ? COLOR.green
                                : isLast
                                ? COLOR.blue
                                : '#999',
                              borderRadius: isFirst ? 10 : isLast ? 0 : 50,
                            }}
                          />

                          {/* BOTTOM DOTS (hide for last item) */}
                          {index !== totalStops - 1 && (
                            <View style={{ alignItems: 'center' }}>
                              <Text style={{ fontSize: 5 }}>•</Text>
                              <Text style={{ fontSize: 5 }}>•</Text>
                              <Text style={{ fontSize: 5 }}>•</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                  <View>
                    {item?.data?.stops.length != 0 ? (
                      <>
                        <View style={{ width: width * 0.6 }}>
                          <Text
                            numberOfLines={2}
                            style={{ fontSize: fontSize.font14 }}
                          >
                            {item?.data?.pickup?.address}
                          </Text>
                        </View>
                        {item?.data?.stops?.map(stop => {
                          console.log('This is a stop:::::::', stop);
                          return (
                            <View
                              style={{
                                width: width * 0.6,
                                marginTop: spacing.hp21,
                              }}
                            >
                              <Text
                                numberOfLines={2}
                                style={{ fontSize: fontSize.font14 }}
                              >
                                {stop?.Address}
                              </Text>
                            </View>
                          );
                        })}
                        <View
                          style={{
                            width: width * 0.6,
                            marginTop: spacing.hp21,
                          }}
                        >
                          <Text
                            numberOfLines={2}
                            style={{ fontSize: fontSize.font14 }}
                          >
                            {item?.data?.dropoff?.address}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={{ width: width * 0.6 }}>
                          <Text style={{ fontSize: fontSize.font14 }}>
                            {item?.data?.pickup?.address}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: width * 0.6,
                            marginTop: spacing.hp21,
                          }}
                        >
                          <Text style={{ fontSize: fontSize.font14 }}>
                            {item?.data?.dropoff?.address}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                  <View style={{ gap: spacing?.hp21 }}>
                    <TouchableOpacity>
                      <Call></Call>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Chat', {
                          data: route?.params?.bidDetails,
                        });
                      }}
                    >
                      <Message></Message>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'flex-start',
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text
                      style={{
                        fontSize: height * 0.02,
                        fontWeight: WEIGHT.bold,
                      }}
                    >
                      SAR {item?.data?.fare}{' '}
                      <Text
                        style={{
                          fontWeight: WEIGHT?.semi,
                          fontSize: fontSize?.font11,
                        }}
                      >
                        ({item?.data?.paymentMethod})
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: spacing.wp15,
              paddingVertical: spacing.hp15,
            }}
          >
            {/* Ride button */}
            <TouchableOpacity
              onPress={() => {
                handleRecenter();
                handleRideButtonPress();
              }}
              style={{
                backgroundColor: COLOR.blue,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: spacing.hp15,
                height: button.height,
                width: button.width,
                borderRadius: spacing.hp10,
                alignSelf: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.font18,
                  color: COLOR.white,
                  fontWeight: WEIGHT.semi,
                }}
              >
                {getRideButtonLabel()}
              </Text>
            </TouchableOpacity>

            {/* Cancel button */}
            <TouchableOpacity
              onPress={() => {
                setReasonModal(true);
              }}
              style={{
                backgroundColor: COLOR.fadeRed,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: spacing.hp15,
                height: button.height,
                width: button.width,
                borderRadius: spacing.hp10,
                alignSelf: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.font18,
                  color: COLOR.red,
                  fontWeight: WEIGHT.semi,
                }}
              >
                Cancel Ride
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    right: width * 0.04,
    bottom: height * 0.38,
    flexDirection: 'column',
    gap: height * 0.012,
  },
});

export default MapViewRequest;
