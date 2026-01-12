import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLOR } from '../../../utils/color';
import { fontSize, spacing } from '../../../utils/scaling';
import { WEIGHT } from '../../../utils/weight';
import RatingStar from '../../../assets/icons/rating-star.svg';
import Dots from '../../../assets/icons/dots.svg';
import DotLine from '../../../assets/icons/dot-line.svg';
import Mic from '../../../assets/icons/mic.svg';
import Form from '../../../assets/icons/form.svg';
import Gallery from '../../../assets/icons/gallery.svg';
import Right from '../../../assets/icons/right-arrow.svg';
import Complain from '../../../assets/icons/Complain.svg';
import Hide from '../../../assets/icons/Hide.svg';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import MediaModal from '../../../components/components/Modals/Media/MediaModal';
import BidModal from '../Modals/BidModal/BidModal';
import { useDispatch } from 'react-redux';
import { setBids } from '../../../store/actions';

const Bid = ({ navigation, formatTime, item }: any) => {
  const { height, width } = Dimensions?.get('window');
  const TOTAL_TIME = 20; // seconds
  const [progress, setProgress] = useState(1); // 1 → full
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [expanded, setExpanded] = useState(false);
  const [bidModal, setBidModal] = useState(false);

  const progressAnim = useRef(new Animated.Value(1)).current;
  function calculateDistanceKm(
    pickupLat: any,
    pickupLon: any,
    dropOffLat: any,
    dropOffLon: any,
  ) {
    const R = 6371; // Earth radius in km

    // Convert degrees to radians
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
  function timeAgo(timestamp: any) {
    const past: any = new Date(timestamp);
    const now: any = new Date();
    const diffMs = now - past;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes <= 0) {
      return 'Just Now';
    } else if (diffMinutes === 1) {
      return '1 minute ago';
    } else {
      return `${diffMinutes} minutes ago`;
    }
  }
  useEffect(() => {
    // Animate the value from 1 → 0
    const animation = Animated.timing(progressAnim, {
      toValue: 0,
      duration: TOTAL_TIME * 1000,
      useNativeDriver: false, // ❌ must be false for progress
    });

    animation.start();

    // Listen to animated value changes
    const listenerId = progressAnim.addListener(({ value }) => {
      setProgress(value); // update state so ProgressBar re-renders
    });

    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      progressAnim.removeListener(listenerId);
    };
  }, []);

  // Helper to format seconds as MM:SS
  const [mediaModal, setMediaModal] = useState(false);
  const boxRef = useRef(null);
  const stopsCount = item?.data?.stops?.length || 0;
  const totalStops = stopsCount + 2; // pickup + stops + dropoff
  return (
    <>
      <MediaModal
        item={item}
        mediaModal={mediaModal}
        setMediaModal={setMediaModal}
      ></MediaModal>
      <BidModal
        navigation={navigation}
        item={item}
        bidModal={bidModal}
        setBidModal={setBidModal}
      ></BidModal>
      <TouchableOpacity
        onPress={() => {
          setBidModal(!bidModal);
        }}
        style={{
          borderBottomWidth: 1,
          borderColor: item?.data?.IsRejected ? COLOR.red : COLOR.grey,
          marginHorizontal: spacing.wp15,
          backgroundColor: COLOR.white,
          paddingHorizontal: spacing?.wp15,
          paddingVertical: spacing.hp15,
          borderWidth: item?.data?.IsRejected ? 2 : 0,
        }}
      >
        {item?.data?.IsRejected ? (
          <Text
            style={{
              marginBottom: spacing.hp10,
              fontWeight: WEIGHT?.bold,
              color: COLOR.red,
              textAlign: 'right',
            }}
          >
            Rejected
          </Text>
        ) : (
          <></>
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{ display: 'flex', flexDirection: 'row', gap: width * 0.02 }}
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
            <View>
              <Text
                style={{
                  fontSize: fontSize.font14,
                  color: COLOR.black,
                  fontWeight: WEIGHT.semi,
                }}
              >
                {item?.data?.customer?.name}{' '}
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
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: width * 0.02,
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
              </View>
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
          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: width * 0.035,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Text
                style={{ fontSize: height * 0.02, fontWeight: WEIGHT.bold }}
              >
                SAR {item?.data?.fare}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setExpanded(!expanded);
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: height * 0.02,
                  width: width * 0.02,
                }}
              >
                <Dots></Dots>
              </TouchableOpacity>
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
                {item?.data?.isASAP ? 'ASAP' : item?.data?.serviceDateTime}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: spacing.hp10, marginLeft: width * 0.12 }}>
          <Text
            style={{
              fontSize: fontSize.font11,
              fontWeight: WEIGHT.bold,
              color: COLOR.blue,
            }}
          >
            Offered Fare: SAR {item?.data?.fare}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              marginTop: 5,
            }}
          >
            {/* Progress Bar Container */}
            <View
              style={{
                width: width * 0.67,
                height: height * 0.004,
                backgroundColor: COLOR.fadeBlue,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              {/* Animated Progress */}
              <Animated.View
                style={{
                  height: '100%',
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: COLOR.blue,
                }}
              />
            </View>

            <Text
              style={{
                marginLeft: width * 0.02,
                fontWeight: WEIGHT.semi,
                color: COLOR.blue,
              }}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        <View
          style={{ display: 'flex', flexDirection: 'row', gap: spacing.wp15 }}
        >
          <View style={{ alignItems: 'center', marginTop: spacing?.hp6 }}>
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
                <View style={{ width: width * 0.8 }}>
                  <Text style={{ fontSize: fontSize.font14 }}>
                    {item?.data?.pickup?.address}
                  </Text>
                </View>
                {item?.data?.stops?.map(stop => {
                  console.log('This is a stop:::::::', stop);
                  return (
                    <View
                      style={{ width: width * 0.8, marginTop: spacing.hp21 }}
                    >
                      <Text style={{ fontSize: fontSize.font14 }}>
                        {stop?.Address}
                      </Text>
                    </View>
                  );
                })}
                <View style={{ width: width * 0.8, marginTop: spacing.hp21 }}>
                  <Text style={{ fontSize: fontSize.font14 }}>
                    {item?.data?.dropoff?.address}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={{ width: width * 0.8 }}>
                  <Text style={{ fontSize: fontSize.font14 }}>
                    {item?.data?.pickup?.address}
                  </Text>
                </View>
                <View style={{ width: width * 0.8, marginTop: spacing.hp21 }}>
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
            paddingLeft: width * 0.05,
            display: 'flex',
            flexDirection: 'row',
            gap: spacing.wp15,
            marginTop: spacing.hp15,
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
        <TouchableOpacity
          onPress={() => {
            setMediaModal(!mediaModal);
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingLeft: width * 0.04,
            marginTop: spacing.hp15,
            gap: spacing.wp10,
          }}
        >
          <View
            style={{
              padding: spacing.hp6,
              borderRadius: spacing.hp50,
              backgroundColor: COLOR.fadeBlue,
            }}
          >
            <Mic></Mic>
          </View>
          <View
            style={{
              padding: spacing.hp6,
              borderRadius: spacing.hp50,
              backgroundColor: COLOR.fadeBlue,
            }}
          >
            <Form></Form>
          </View>
          <View
            style={{
              padding: spacing.hp6,
              borderRadius: spacing.hp50,
              backgroundColor: COLOR.fadeBlue,
            }}
          >
            <Gallery></Gallery>
          </View>
          <View style={{ padding: spacing.hp6, borderRadius: spacing.hp50 }}>
            <Right></Right>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
      <Collapsible collapsed={expanded}>
        <Animatable.View
          ref={boxRef}
          style={{
            height: height * 0.22,
            backgroundColor: COLOR.fadeBlue,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'row',
            paddingHorizontal: width * 0.05,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setExpanded(expanded ? false : true);
            }}
            style={{
              width: width * 0.06,
              height: height * 0.028,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Dots></Dots>
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
              }}
            >
              <TouchableOpacity
                style={{ alignItems: 'center', gap: spacing.hp6 }}
              >
                <Complain></Complain>
                <Text
                  style={{
                    fontSize: fontSize.font14,
                    fontWeight: WEIGHT.semi,
                    color: COLOR.black,
                  }}
                >
                  Complain
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: 'center', gap: spacing.hp6 }}
              >
                <Hide></Hide>
                <Text
                  style={{
                    fontSize: fontSize.font14,
                    fontWeight: WEIGHT.semi,
                    color: COLOR.black,
                    flexDirection: 'column',
                    display: 'flex',
                  }}
                >
                  Hide
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      </Collapsible>
    </>
  );
};
export default Bid;
