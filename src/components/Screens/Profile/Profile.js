import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import VerifyBadge from '../../../assets/icons/badge.svg';
import CircleFlag from '../../../assets/icons/circle-flag.svg';
import { COLOR } from '../../../utils/color';
import Star from '../../../assets/icons/star.svg';
import Right from '../../../assets/icons/right.svg';
import { Switch } from 'react-native-paper';
import Icon1 from '../../../assets/icons/settings/1.svg';
import Icon2 from '../../../assets/icons/settings/2.svg';
import Icon3 from '../../../assets/icons/settings/3.svg';
import Icon4 from '../../../assets/icons/settings/4.svg';
import Icon5 from '../../../assets/icons/settings/5.svg';
import Icon6 from '../../../assets/icons/settings/6.svg';
import Icon7 from '../../../assets/icons/settings/7.svg';
import Icon8 from '../../../assets/icons/settings/8.svg';
import Icon9 from '../../../assets/icons/settings/9.svg';
import Icon11 from '../../../assets/icons/settings/11.svg';
import Icon12 from '../../../assets/icons/settings/12.svg';
import Icon13 from '../../../assets/icons/settings/13.svg';
import Icon14 from '../../../assets/icons/settings/14.svg';
import { WEIGHT } from '../../../utils/weight';
import Back from '../../../assets/icons/back.svg';
import { fontSize, spacing } from '../../../utils/scaling';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../../store/actions';

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  // const PROFILE = useSelector(state => state?.user);
  const PROFILE = useSelector(state => state?.user);
  const profileList = [
    {
      name: 'Upgrade to Company',
      subList: [{ name: 'Upgrade to Company', Icon: Icon1 }],
    },
    {
      name: 'Add Sub Users',
      subList: [{ name: 'Add Sub Users', Icon: Icon2 }],
    },
    {
      name: 'Settings',
      subList: [
        { name: 'Edit Profile', Icon: Icon3 },
        { name: 'Payment Methods', Icon: Icon4 },
        { name: 'Notifications', Icon: Icon5 },
        { name: 'Wallet', Icon: Icon6 },
        { name: 'Dark Mode', Icon: Icon7 },
        { name: 'Trip History', Icon: Icon8 },
      ],
    },
    {
      name: 'Addresses',
      subList: [{ name: 'Saved Addresses', Icon: Icon9 }],
    },
    {
      name: 'Support & Legal',
      subList: [
        { name: 'Help & Support', Icon: Icon11 },
        { name: 'Terms & Conditions', Icon: Icon12 },
      ],
    },
    {
      name: 'More',
      subList: [
        { name: 'Delete Account', Icon: Icon13 },
        { name: 'Sign out', Icon: Icon14 },
      ],
    },
  ];
  console.log(PROFILE);
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          display: 'flex',
          flex: 1,
          paddingHorizontal: spacing.wp15,
          paddingTop:
            Platform.OS == 'ios'
              ? Dimensions.get('window').height * 0.001
              : Dimensions.get('window').height * 0.03,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: COLOR.grey,
            paddingBottom: spacing.hp15,
            marginTop: spacing.hp25,
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Image
              style={{
                height: Dimensions.get('window').height * 0.06,
                width: Dimensions.get('window').width * 0.13,
                borderRadius:spacing?.hp34
              }}
              source={
                PROFILE?.imageUrl != null
                  ? { uri: PROFILE?.imageUrl }
                  : require('../../../assets/Images/logo/place-holder.jpg')
              }
            ></Image>
            <View
              style={{ justifyContent: 'center', marginLeft: spacing.wp10 }}
            >
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: spacing.wp5,
                }}
              >
                <Text
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: fontSize.font24,
                    fontWeight: WEIGHT.semi,
                    color: COLOR.black,
                  }}
                >
                  {PROFILE.name}
                </Text>
                <VerifyBadge
                  height={Dimensions.get('window').height * 0.04}
                  width={Dimensions.get('window').width * 0.06}
                ></VerifyBadge>
              </View>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.font14,
                    color: COLOR.black,
                    marginLeft: spacing.wp5,
                    gap: spacing.wp15,
                  }}
                >
                  {PROFILE?.phone.split(':')[0] +
                    ' ' +
                    PROFILE?.phone.split(':')[1] +
                    ' ' +
                    PROFILE?.phone.split(':')[2]}
                </Text>
              </View>
              <View style={{ marginTop: spacing.hp6 }}>
                <Text
                  style={{
                    color: COLOR.blue,
                    fontWeight: WEIGHT.semi,
                    fontSize: fontSize.font14,
                  }}
                >
                  {Number(PROFILE?.profilePercentage).toFixed(0)}% profile
                  completed
                </Text>
              </View>
            </View>
          </View>
          <View>
            <View style={{ alignItems: 'flex-end' }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  backgroundColor: COLOR.fadeBlue,
                  paddingVertical: spacing.hp6,
                  paddingHorizontal: spacing.wp10,
                  alignItems: 'center',
                  gap: spacing.wp5,
                  borderRadius: spacing.hp6,
                }}
              >
                <Star height={Dimensions.get('window').height * 0.015}></Star>
                <Text
                  style={{
                    color: COLOR.blue,
                    fontSize: fontSize.font14,
                    fontWeight: WEIGHT.semi,
                  }}
                >
                  {PROFILE?.rating}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Complete', { action: 'edit' });
                  }}
                >
                  <Text
                    style={{
                      color: COLOR.blue,
                      fontSize: fontSize.font14,
                      fontWeight: WEIGHT.semi,
                      marginTop: spacing.hp6,
                    }}
                  >
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingVertical: spacing?.hp10,
            gap: spacing?.wp10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              paddingHorizontal: spacing?.hp34,
              paddingVertical:spacing?.hp21,
              backgroundColor: COLOR?.fadeBlue,
              borderRadius: spacing?.hp6,
              alignItems: 'center',
              gap: spacing?.hp6,
            }}
          >
            <Text style={{ color: COLOR?.black, fontSize: fontSize?.font14 }}>
              Total Trips
            </Text>
            <Text style={{ color: COLOR?.black, fontSize: fontSize?.font16,fontWeight:WEIGHT?.bold }}>
              {PROFILE?.totalTrips}
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: spacing?.hp34,
              paddingVertical:spacing?.hp21,
              backgroundColor: COLOR?.fadeBlue,
              borderRadius: spacing?.hp6,
              alignItems: 'center',
              gap: spacing?.hp6,
            }}
          >
            <Text style={{ color: COLOR?.black, fontSize: fontSize?.font14 }}>
              Acceptance
            </Text>
            <Text style={{ color: COLOR?.black, fontSize: fontSize?.font16, fontWeight:WEIGHT?.bold }}>
              {PROFILE?.acceptance} %
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: spacing?.hp34,
              paddingVertical:spacing?.hp21,
              backgroundColor: COLOR?.fadeBlue,
              borderRadius: spacing?.hp6,
              alignItems: 'center',
              gap: spacing?.hp6,
            }}
          >
            <Text style={{ color: COLOR?.black, fontSize: fontSize?.font14 }}>
              Balance
            </Text>
            <Text style={{ color: COLOR?.black, fontSize: fontSize?.font16, fontWeight:WEIGHT?.bold }}>
              {PROFILE?.balance}
            </Text>
          </View>
        </View>
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={profileList}
            contentContainerStyle={{
              paddingBottom:Dimensions.get('window').height * 0.25
            }}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text
                    style={{
                      fontWeight: WEIGHT.semi,
                      fontSize: fontSize.font18,
                      color: COLOR.blue,
                      marginTop: spacing.hp21,
                      marginBottom: spacing.hp10,
                    }}
                  >
                    {item.name}
                  </Text>
                  {item?.subList?.map((childItem, index) => {
                    const IconTag = childItem.Icon;
                    return (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            if (childItem?.name == 'Upgrade to Company') {
                              navigation.navigate('UpgradeCompany', {
                                title: childItem?.name,
                              });
                            } else if (childItem?.name == 'Add Sub Users') {
                              navigation.navigate('SubUser', {
                                title: 'Add Sub User',
                              });
                            } else if (childItem?.name == 'Trip History') {
                              navigation.navigate('TripHistory', {
                                title: 'Trip History',
                              });
                            } else if (childItem?.name == 'Wallet') {
                              navigation.navigate('Wallet', {
                                title: 'Trip History',
                              });
                            } else if (childItem?.name == 'Help & Support') {
                              navigation.navigate('Support', {
                                title: 'Support & Help',
                              });
                            } else if (childItem?.name == 'Saved Addresses') {
                              navigation.navigate('SavedAddressess', {
                                title: 'Saved Addresses',
                              });
                            } else if (childItem.name == 'Sign out') {
                              dispatch(setToken(null));
                              navigation.navigate('PhoneVerification');
                            } else if (childItem.name == 'Edit Profile') {
                              navigation.navigate('Complete', {
                                action: 'edit',
                              });
                            }
                          }}
                          style={{
                            backgroundColor: COLOR.white,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: spacing.hp15,
                            paddingHorizontal: spacing.wp15,
                            borderTopLeftRadius: index === 0 ? spacing.hp10 : 0,
                            borderTopRightRadius:
                              index === 0 ? spacing.hp10 : 0,
                            borderBottomRightRadius:
                              index === item.subList.length - 1
                                ? spacing.hp10
                                : 0,
                            borderBottomLeftRadius:
                              index === item.subList.length - 1
                                ? spacing.hp10
                                : 0,
                          }}
                        >
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: Dimensions.get('window').width * 0.04,
                            }}
                          >
                            <IconTag
                              height={Dimensions.get('window').height * 0.045}
                              width={Dimensions.get('window').width * 0.1}
                            ></IconTag>
                            <Text
                              style={{
                                fontWeight: WEIGHT.semi,
                                fontSize: fontSize.font16,
                                color:
                                  childItem.name == 'Sign out'
                                    ? COLOR.red
                                    : COLOR.black,
                              }}
                            >
                              {childItem.name}
                            </Text>
                          </View>
                          {childItem.name == 'Dark Mode' ? (
                            <Switch color={COLOR.blue} value={true}></Switch>
                          ) : (
                            <Right
                              height={Dimensions.get('window').height * 0.012}
                            ></Right>
                          )}
                        </TouchableOpacity>
                        {item.subList.length > 1 &&
                        index !== item.subList.length - 1 ? (
                          <View
                            style={{
                              borderBottomWidth: 1,
                              borderColor: COLOR.grey,
                            }}
                          />
                        ) : null}
                      </>
                    );
                  })}
                </View>
              );
            }}
          ></FlatList>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Profile;
