import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fontSize, spacing } from '../../../../utils/scaling';
import { COLOR } from '../../../../utils/color';
import { WEIGHT } from '../../../../utils/weight';
import Close from '../../../../assets/icons/close.svg';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDriverBiddingDetail } from '../../../../api/useDriverBiddingDetail';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { useIsFocused } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { setBids } from '../../../../store/actions';
const BidModal = ({ navigation, item, bidModal, setBidModal }: any) => {
  const TOKEN = useSelector((state: any) => state?.token);
  const { height, width } = Dimensions.get('window');
  const [showTimeField, setShowTimeField] = useState(false);
  const { driverBiddingDetails, error, loading } = useDriverBiddingDetail();
  const isFocused = useIsFocused();
  const [location, setLocation] = useState<any>(null);
  const BIDS = useSelector((state:any) => state?.bids);
  const dispatch = useDispatch();
  function timeAgo(timestamp: any) {
    const past: any = new Date(timestamp);
    const now: any = new Date();
    const diffMs = now - past;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes <= 0) {
      return 'Just Now';
    } else if (diffMinutes === 1) {
      return '1 m';
    } else {
      return `${diffMinutes} m`;
    }
  }
  function calculateDistanceKm(
    pickupLat: any,
    pickupLon: any,
    dropOffLat: any,
    dropOffLon: any,
  ) {
    const R = 6371; // Earth radius in km

    // Convert degrees to radians
    const toRad = (value: any) => (value * Math.PI) / 180;

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
  const [offerTrue, setOfferTrue] = useState(false);
  const handleDriverBidding = (item: any) => {
    setOfferTrue(!offerTrue);
  };
  const handleDriverAction = async () => {
    await driverBiddingDetails(TOKEN, {
      jobId: item?.data?.jobId,
      fare: offerField ? offer : item?.data?.fare,
      timeOnly:
        selectedTime != null ? selectedTime?.toLocaleTimeString() : null,
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    }).then(result => {
      if (result?.success == true) {
        setOfferTrue(false);
        setOfferField(false);
      }
    });
  };
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      (position:any) => {
        setLocation(position);
      },
      error => {
        console.log(error?.code, error?.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  useEffect(() => {
    getLocation();
  }, [isFocused]);

  useEffect(() => {
    if (item?.data?.IsAccepted == true) {
      navigation?.navigate('MapViewRequest', { bidDetails: item });
    }
    if (item.type == 'RIDE_REQUEST_CANCELLED') {
      setBidModal(false);
      dispatch(setBids(BIDS.filter((b:any) => b.jobId !== item?.data?.jobId)));
    }
  }, [item]);
  // const [showTimeField, setShowTimeField] = useState(false);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [offerField, setOfferField] = useState(false);
  const [offer, setOffer] = useState<any>(null);
  const stopsCount = item?.data?.stops?.length || 0;
  const totalStops = stopsCount + 2; // pickup + stops + dropoff
  return (
    <Modal
      transparent
      animationType="slide"
      visible={bidModal}
      onRequestClose={() => {
        setOfferField(false);
        setShowTimeField(false);
      }}
    >
      <SafeAreaProvider>
        {/* Background overlay */}
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent backdrop
            justifyContent: 'flex-end', // push to bottom
          }}
        >
          {/* Modal content container */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}} // prevents modal close on inner touch
            style={{
              backgroundColor: 'transparent',
              borderTopLeftRadius: spacing.hp15,
              borderTopRightRadius: spacing.hp15,
              height:
                Platform.OS == 'ios'
                  ? '48%'
                  : offerField
                  ? offerTrue
                    ? '48%'
                    : '58%'
                  : '50%', // ✅ only 70% of screen height
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                paddingHorizontal: spacing.wp15,
                paddingTop: spacing.hp25,
                paddingBottom: spacing.hp15,
                flexDirection: 'row',
                borderColor: COLOR.grey,
              }}
            >
              <Text
                style={{
                  color: COLOR.black,
                  fontSize: fontSize.font14,
                  fontWeight: WEIGHT.semi,
                }}
              ></Text>
              <TouchableOpacity
                onPress={() => {
                  setBidModal(false);
                  setOfferField(false);
                  setShowTimeField(false);
                }}
              >
                <Close />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: COLOR.white,
                flexGrow: 1,
                gap: spacing.hp10,
                paddingBottom: spacing.hp34,
                borderTopLeftRadius: spacing.hp10,
                borderTopRightRadius: spacing.hp10,
                padding: spacing.hp15,
              }}
            >
              <View
                style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
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
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'flex-start',
                      }}
                    >
                      <View
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <Text
                          style={{
                            fontSize: fontSize.font11,
                            fontWeight: WEIGHT.semi,
                            color: COLOR.black,
                          }}
                        >
                          {' '}
                          ~{' '}
                          {Number(
                            calculateDistanceKm(
                              item?.data?.pickup?.latitude,
                              item?.data?.pickup?.longitude,
                              item?.data?.dropoff?.latitude,
                              item?.data?.dropoff?.longitude,
                            ),
                          ).toFixed(2)}{' '}
                          km
                        </Text>
                        <Text
                          style={{
                            fontSize: height * 0.02,
                            fontWeight: WEIGHT.bold,
                          }}
                        >
                          SAR {item?.data?.fare}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: COLOR.fadeBlue,
                          paddingVertical: height * 0.004,
                          paddingHorizontal: width * 0.04,
                          borderRadius: width * 0.004,
                          marginTop: height * 0.007,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSize.font11,
                            color: COLOR.blue,
                            fontWeight: WEIGHT.semi,
                          }}
                        >
                          {item?.data?.isASAP
                            ? 'ASAP'
                            : item?.data?.serviceDateTime}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: spacing.wp15,
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
                                  height:
                                    Dimensions.get('window').height * 0.015,
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
                              <Text style={{ fontSize: fontSize.font14 }}>
                                {item?.data?.pickup?.address}
                              </Text>
                            </View>
                            {item?.data?.stops?.map((stop:any) => {
                              console.log('This is a stop:::::::', stop);
                              return (
                                <View
                                  style={{
                                    width: width * 0.6,
                                    marginTop: spacing.hp21,
                                  }}
                                >
                                  <Text style={{ fontSize: fontSize.font14 }}>
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
                              <Text style={{ fontSize: fontSize.font14 }}>
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
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: spacing.wp15,
                        marginTop: spacing.hp15,
                        width: '100%',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLOR.fadeBlue,
                          paddingVertical: height * 0.004,
                          paddingHorizontal: width * 0.014,
                          borderRadius: height * 0.004,
                        }}
                      >
                        <Text
                          style={{
                            color: COLOR.blue,
                            fontWeight: WEIGHT.semi,
                            fontSize: fontSize.font11,
                          }}
                        >
                          {item?.data?.paymentMethod}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: COLOR.fadeGreen,
                          paddingVertical: height * 0.004,
                          paddingHorizontal: width * 0.014,
                          borderRadius: height * 0.004,
                        }}
                      >
                        <Text
                          style={{
                            color: COLOR.green,
                            fontWeight: WEIGHT.semi,
                            fontSize: fontSize.font11,
                          }}
                        >
                          {item?.data?.jobType?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: COLOR.fadeRed,
                          paddingVertical: height * 0.004,
                          paddingHorizontal: width * 0.014,
                          borderRadius: height * 0.004,
                        }}
                      >
                        <Text
                          style={{
                            color: COLOR.red,
                            fontWeight: WEIGHT.semi,
                            fontSize: fontSize.font11,
                          }}
                        >
                          {item?.data?.vehicleCategory?.name} /{' '}
                          {item?.data?.vehicleSubCategory?.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {!offerField ? (
                <TouchableOpacity
                  onPress={() => {
                    handleDriverAction();
                  }}
                  style={{
                    width: width * 0.85,
                    marginTop: spacing?.hp15,
                    borderRadius: spacing?.hp6,
                    backgroundColor: COLOR.blue,
                    paddingVertical: spacing?.hp10,
                    paddingHorizontal: width * 0.02,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSize?.font18,
                      color: COLOR.white,
                      fontWeight: WEIGHT?.semi,
                    }}
                  >
                    Accept for SAR {item?.data?.fare}
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {offerTrue == false ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setShowTimeField(!showTimeField);
                    }}
                    style={{
                      alignSelf: 'center',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing?.wp10,
                      marginTop: spacing?.hp6,
                      borderRadius: selectedTime != null ? spacing?.hp6 : 0,
                      backgroundColor:
                        selectedTime != null ? COLOR.fadeBlue : 'trasparent',
                      padding: selectedTime != null ? spacing?.hp10 : 0,
                    }}
                  >
                    <Ionicons
                      name={'information-circle'}
                      color={COLOR.blue}
                      size={height * 0.018}
                    ></Ionicons>
                    <Text
                      style={{
                        color: COLOR.blue,
                        fontSize: fontSize.font14,
                        fontWeight: WEIGHT?.semi,
                      }}
                    >
                      Set ETA{' '}
                      {selectedTime ? (
                        <Text>
                          {selectedTime?.toLocaleTimeString().split(':')[0] +
                            'h'}{' '}
                          :{' '}
                          {selectedTime?.toLocaleTimeString().split(':')[1] +
                            ' min'}
                        </Text>
                      ) : (
                        <></>
                      )}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal={true}
                    mode="time"
                    open={showTimeField}
                    minimumDate={new Date()}
                    date={new Date()}
                    onConfirm={(time: any) => {
                      setSelectedTime(time); // ✅ save date
                      setShowTimeField(false); // ✅ close modal
                    }}
                    onCancel={() => setShowTimeField(false)}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setOfferField(!offerField);
                    }}
                    style={{
                      alignSelf: 'center',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing?.wp10,
                      marginTop: spacing?.hp6,
                    }}
                  >
                    <Text
                      style={{
                        color: COLOR.blue,
                        fontSize: fontSize.font18,
                        fontWeight: WEIGHT?.semi,
                      }}
                    >
                      Offer your Fare
                    </Text>
                  </TouchableOpacity>
                  <View style={{ alignItems: 'center' }}>
                    {offerField ? (
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          borderBottomWidth: 1,
                          borderColor: COLOR.fadeGrey,
                          marginBottom: spacing.hp6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSize?.font24,
                            fontWeight: WEIGHT.bold,
                            color: COLOR.black,
                          }}
                        >
                          SAR
                        </Text>
                        <TextInput
                          keyboardType={'numeric'}
                          inputMode={'decimal'}
                          style={{
                            width: width * 0.12,
                            fontSize: fontSize?.font24,
                            fontWeight: WEIGHT.bold,
                            textAlign: 'center',
                          }}
                          value={offer}
                          onChangeText={(offer: any) => {
                            setOffer(offer);
                          }}
                        ></TextInput>
                      </View>
                    ) : (
                      <></>
                    )}
                    {offerField ? (
                      <TouchableOpacity
                        onPress={() => {
                          handleDriverBidding(item);
                        }}
                        style={{
                          width: width * 0.85,
                          marginTop: spacing?.hp15,
                          borderRadius: spacing?.hp6,
                          backgroundColor: COLOR.blue,
                          paddingVertical: spacing?.hp10,
                          paddingHorizontal: width * 0.02,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSize?.font18,
                            color: COLOR.white,
                            fontWeight: WEIGHT?.semi,
                          }}
                        >
                          Offer
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <></>
                    )}
                  </View>
                </>
              ) : (
                <>
                  {/* <TouchableOpacity
                onPress={() => {
                  setShowTimeField(!showTimeField);
                }}
                style={{
                  alignSelf: 'center',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing?.wp10,
                  marginTop: spacing?.hp6,
                  borderRadius: selectedTime != null ? spacing?.hp6 : 0,
                  backgroundColor:
                    selectedTime != null ? COLOR.fadeBlue : 'trasparent',
                  padding: selectedTime != null ? spacing?.hp10 : 0,
                }}
              >
                <Ionicons
                  name={'information-circle'}
                  color={COLOR.blue}
                  size={height * 0.018}
                ></Ionicons>
                <Text
                  style={{
                    color: COLOR.blue,
                    fontSize: fontSize.font14,
                    fontWeight: WEIGHT?.semi,
                  }}
                >
                  Set ETA{' '}
                  {selectedTime ? (
                    <Text>
                      {selectedTime?.toLocaleTimeString().split(':')[0] + 'h'} :{' '}
                      {selectedTime?.toLocaleTimeString().split(':')[1] +
                        ' min'}
                    </Text>
                  ) : (
                    <></>
                  )}
                </Text>
              </TouchableOpacity> */}
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: spacing?.wp5,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: WEIGHT?.semi,
                        fontSize: fontSize?.font14,
                        color: COLOR.blue,
                      }}
                    >
                      ETA:
                    </Text>
                    <Text>
                      {selectedTime ? (
                        <Text
                          style={{
                            fontWeight: WEIGHT?.bold,
                            fontSize: fontSize?.font14,
                            color: COLOR.blue,
                          }}
                        >
                          {selectedTime?.toLocaleTimeString().split(':')[0] +
                            'h'}{' '}
                          :{' '}
                          {selectedTime?.toLocaleTimeString().split(':')[1] +
                            ' min'}
                        </Text>
                      ) : (
                        <></>
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'row',
                      gap: spacing.wp5,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSize.font14,
                        fontWeight: WEIGHT?.semi,
                        color: COLOR.blue,
                      }}
                    >
                      Your Offer:
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSize.font14,
                        fontWeight: WEIGHT?.semi,
                        color: COLOR.blue,
                      }}
                    >
                      SAR {item?.data?.fare}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      handleDriverAction();
                    }}
                    style={{
                      width: width * 0.85,
                      marginTop: spacing?.hp15,
                      borderRadius: spacing?.hp6,
                      backgroundColor: COLOR.blue,
                      paddingVertical: spacing?.hp10,
                      paddingHorizontal: width * 0.02,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSize?.font18,
                        color: COLOR.white,
                        fontWeight: WEIGHT?.semi,
                      }}
                    >
                      Offer
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
};

export default BidModal;
