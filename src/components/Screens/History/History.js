import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../../styles';
import { COLOR } from '../../../utils/color';
import { WEIGHT } from '../../../utils/weight';
import Back from '../../../assets/icons/back.svg';
import Trip from '../../../assets/icons/vehicle.svg';
import { fontSize, spacing } from '../../../utils/scaling';
import { useTripHistory } from '../../../api/useTripHistory';
import { useSelector } from 'react-redux';

const History = ({ route, navigation }) => {
  const tripType = ['All', 'Active', 'Completed', 'Cancelled'];
  const [type, setType] = useState(0);
  const { getTripHistory, error, loading } = useTripHistory();
  const TOKEN = useSelector(state => state?.token);
  const [trips, setTrips] = useState(null);
  const JOB_DETAILS = useSelector(state => state?.jobDetails);
  const { width, height } = Dimensions.get('window');
    const [filteredTrips, setFilteredTrips] = useState([]);

    useEffect(() => {
    if (!trips?.length) return;

    let data = trips;

    if (type === 1) {
      data = trips.filter(item => item?.isActive);
    } else if (type === 2) {
      data = trips.filter(item => item?.isCompleted);
    } else if (type === 3) {
      data = trips.filter(item => item?.isCancelled);
    }

    setFilteredTrips(data);
  }, [type, trips]);
  useEffect(() => {
    const tripHistory = async () => {
      await getTripHistory(TOKEN)?.then(result => {
        if (result?.status) {
          setTrips(result?.result);
        }
      });
    };
    tripHistory();
  }, [TOKEN]);
  const formatDate = date => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${month}, ${year}`;
  };
  const formatTime12 = dateString => {
    const d = new Date(dateString);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };
  const stopsCount = JOB_DETAILS?.stopsDetail?.length || 0;
  const totalStops = stopsCount + 2; // pickup + stops + dropoff

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop:
            Platform.OS == 'ios'
              ? Dimensions.get('window').height * 0.001
              : Dimensions.get('window').height * 0.03,
          marginHorizontal: spacing.wp15,
        }}
      >
        <View
          style={[
            styles.header,
            {
              borderBottomWidth: 1,
              borderColor: COLOR.grey,
              justifyContent: 'flex-start',
              paddingBottom: spacing.hp15,
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
          ]}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
            >
                <Text style={{fontSize:fontSize?.font24,fontWeight:WEIGHT?.bold}}>Trip History</Text>
            </View>
            <Text
              style={{
                marginLeft: spacing.wp15,
                fontSize: fontSize.font24,
                fontWeight: WEIGHT.semi,
              }}
            >
              {route?.params?.title}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: spacing.hp15,
              gap: Dimensions.get('window').width * 0.03,
            }}
          >
            {tripType?.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setType(index);
                  }}
                  style={{
                    paddingHorizontal: spacing.wp10,
                    paddingVertical: Dimensions.get('window').height * 0.004,
                    backgroundColor:
                      type == index ? COLOR.blue : COLOR.fadeBlue,
                    borderRadius: spacing.hp6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSize.font16,
                      fontWeight: WEIGHT.semi,
                      color: type == index ? COLOR.white : COLOR.blue,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <FlatList
          data={filteredTrips}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            console.log('Trip',item);
            return (
              <View
                style={{
                  backgroundColor: COLOR.white,
                  marginTop: spacing.hp21,
                  borderTopLeftRadius: spacing.hp10,
                  borderTopRightRadius: spacing.hp10,
                }}
              >
                <View
                  style={{
                    paddingHorizontal: spacing.wp15,
                    paddingTop: spacing.hp15,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Trip></Trip>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{ marginLeft: spacing.wp15 }}>
                        <Text
                          style={{
                            fontSize: fontSize.font14,
                            fontWeight: WEIGHT.semi,
                            color: COLOR.black,
                          }}
                        >
                          {item?.jobTypeName}
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSize.font11,
                            fontWeight: WEIGHT.semi,
                            color: COLOR.grey,
                            marginTop: Dimensions.get('window').height * 0.002,
                          }}
                        >
                          {item?.vehicleCategoryName}-
                          {item?.vehicleSubCategoryName}
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSize.font11,
                            color: COLOR.black,
                            marginTop: Dimensions.get('window').height * 0.002,
                          }}
                        >
                          {formatDate(item?.updatedAt)} -{' '}
                          {formatTime12(item?.updatedAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View>
                      {item?.isCompleted ? (
                        <Text
                          style={{
                            fontSize: fontSize.font14,
                            fontWeight: WEIGHT.semi,
                            paddingHorizontal: spacing.wp15,
                            borderRadius: spacing.hp6,
                            paddingVertical:
                              Dimensions.get('window').height * 0.001,
                            backgroundColor: COLOR.fadeBlue,
                            textAlign: 'center',
                            color: COLOR.blue,
                          }}
                        >
                          Completed
                        </Text>
                      ) : (
                        ''
                      )}

                      <Text
                        style={{
                          fontSize: fontSize.font14,
                          fontWeight: WEIGHT.semi,
                          paddingHorizontal: spacing.wp15,
                          borderRadius: spacing.hp6,
                          paddingVertical:
                            Dimensions.get('window').height * 0.001,
                          backgroundColor: COLOR.fadeBlue,
                          marginTop: spacing.hp6,
                          textAlign: 'center',
                          color: COLOR.blue,
                        }}
                      >
                        {item?.paymentMethod}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: spacing.wp15,
                    paddingHorizontal: spacing?.wp15,
                    paddingVertical: spacing?.hp15,
                  }}
                >
                  <View
                    style={{ alignItems: 'center', marginTop: spacing?.hp6 }}
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
                    {item?.stops?.length != 0 ? (
                      <>
                        <View style={{ width: width * 0.8 }}>
                          <Text style={{ fontSize: fontSize.font14 }}>
                            {item?.pickupLocation}
                          </Text>
                        </View>
                        {item?.stops?.map(stop => {
                          console.log('This is a stop:::::::', stop);
                          return (
                            <View
                              style={{
                                width: width * 0.8,
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
                            width: width * 0.8,
                            marginTop: spacing.hp21,
                          }}
                        >
                          <Text style={{ fontSize: fontSize.font14 }}>
                            {item?.dropOffLocation}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={{ width: width * 0.8 }}>
                          <Text style={{ fontSize: fontSize.font14 }}>
                            {item?.pickupLocation}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: width * 0.8,
                            marginTop: spacing.hp21,
                          }}
                        >
                          <Text style={{ fontSize: fontSize.font14 }}>
                            {item?.dropOffLocation}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: COLOR.blue,
                    display: 'flex',
                    flexDirection: 'row',
                    paddingHorizontal: Dimensions.get('window').width * 0.08,
                    paddingVertical: spacing.wp15,
                    justifyContent: 'space-between',
                    borderBottomRightRadius: spacing.hp10,
                    borderBottomLeftRadius: spacing.hp10,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontSize: fontSize.font14,
                        fontWeight: WEIGHT.semi,
                        color: COLOR.white,
                        textDecorationLine: 'underline',
                      }}
                    >
                      Review
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('HistoryDetails',{jobId:item.id});
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSize.font14,
                        fontWeight: WEIGHT.semi,
                        color: COLOR.white,
                        textDecorationLine: 'underline',
                      }}
                    >
                      View Details
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: fontSize.font16,
                      fontWeight: WEIGHT.semi,
                      color: COLOR.white,
                    }}
                  >
                    SAR {item?.fare}
                  </Text>
                </View>
              </View>
            );
          }}
        ></FlatList>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default History;
