import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Back from '../../../assets/icons/back.svg';
import { COLOR } from '../../../utils/color';
import { WEIGHT } from '../../../utils/weight';
import Edit from '../../../assets/icons/edit-location.svg';
import Method1 from '../../../assets/icons/method/apple.svg';
import Method2 from '../../../assets/icons/method/card.svg';
import Method3 from '../../../assets/icons/method/stc.svg';
import Active from '../../../assets/icons/active-radio.svg';
import InActive from '../../../assets/icons/inactive-radio.svg';
import MasterCard from '../../../assets/icons/cards/Card1.svg';
import { spacing } from '../../../utils/scaling';

const RechargeWallet = ({ navigation }) => {
  const methods = [
    {
      name: 'Credit/Debit Card',
      detail: 'Visa/Mastercard/Amex',
      Icon: Method1,
    },
    { name: 'Apple Pay', detail: 'Quick and secure payment', Icon: Method2 },
    { name: 'STC Pay', detail: 'Mobile wallet payment', Icon: Method3 },
  ];
  const [selected, setSelected] = useState(0);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLOR.fadeWhite,
          paddingHorizontal: Dimensions.get('window').width * 0.025,
          paddingTop:
            Platform.OS == 'ios'
              ? Dimensions.get('window').height * 0.01
              : Dimensions.get('window').height * 0.02,
          justifyContent: 'space-between',
          paddingBottom: Dimensions.get('window').height * 0.035,
        }}
      >
        <View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: COLOR.grey,
                paddingBottom: Dimensions.get('window').height * 0.012,
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  style={{
                    height: spacing.hp15,
                    width: spacing.wp15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => navigation.goBack()}
                >
                  <Back />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width * 0.06,
                    fontWeight: WEIGHT.semi,
                    color: COLOR.black,
                    marginLeft: Dimensions.get('window').width * 0.02,
                  }}
                >
                  Recharge Wallet
                </Text>
              </View>
            </View>
          </View>

          {/* Balance Section */}
          <View
            style={{
              backgroundColor: COLOR.blue,
              borderRadius: spacing.hp10,
              width: '100%',
              marginTop: Dimensions.get('window').height * 0.015,
            }}
          >
            <Text
              style={{
                fontSize: Dimensions.get('window').width * 0.03,
                color: COLOR.white,
                fontWeight: WEIGHT.semi,
                marginLeft: Dimensions.get('window').width * 0.05,
                marginTop: Dimensions.get('window').height * 0.015,
              }}
            >
              Available Balance
            </Text>
            <Text
              style={{
                marginLeft: Dimensions.get('window').width * 0.05,
                marginTop: Dimensions.get('window').height * 0.001,
                marginBottom: Dimensions.get('window').height * 0.01,
                fontSize: Dimensions.get('window').width * 0.1,
                fontWeight: WEIGHT.bold,
                color: COLOR.white,
              }}
            >
              SAR 1450
            </Text>
          </View>

          {/* Amount Input */}
          <View
            style={{
              backgroundColor: COLOR.white,
              borderRadius: spacing.hp10,
              marginTop: Dimensions.get('window').height * 0.017,
              paddingBottom: Dimensions.get('window').height * 0.01,
            }}
          >
            <Text
              style={{
                fontSize: Dimensions.get('window').width * 0.03,
                fontWeight: WEIGHT.semi,
                marginLeft: Dimensions.get('window').width * 0.05,
                marginTop: Dimensions.get('window').height * 0.015,
              }}
            >
              Enter Amount
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                fontSize: Dimensions.get('window').width * 0.1,
                fontWeight: WEIGHT.bold,
                color: COLOR.black,
                marginTop: Dimensions.get('window').height * 0.001,
                paddingVertical: 0,
                marginHorizontal: Dimensions.get('window').width * 0.05,
                borderColor: COLOR.grey,
              }}
            >
              SAR 300
            </TextInput>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: Dimensions.get('window').width * 0.05,
                top: Dimensions.get('window').height * 0.048,
              }}
            >
              <Edit height={Dimensions.get('window').height * 0.03} />
            </TouchableOpacity>
          </View>

          {/* Payment Methods */}
          <View style={{ marginTop: Dimensions.get('window').height * 0.03 }}>
            <Text
              style={{
                fontSize: Dimensions.get('window').width * 0.045,
                fontWeight: WEIGHT.semi,
                color: COLOR.blue,
              }}
            >
              Payment Method
            </Text>
            <View
              style={{
                marginTop: Dimensions.get('window').height * 0.01,
                backgroundColor: COLOR.white,
                borderRadius: spacing.hp10,
                paddingBottom: Dimensions.get('window').height * 0.02,
                justifyContent: 'center',
              }}
            >
              {methods?.map((item, index) => {
                const { Icon } = item;
                return (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      onPress={() => setSelected(index)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: Dimensions.get('window').width * 0.04,
                        marginBottom:
                          index != methods.length - 1
                            ? Dimensions.get('window').height * 0.015
                            : 0,
                        marginTop:
                          index == 0
                            ? Dimensions.get('window').height * 0.01
                            : 0,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: Dimensions.get('window').width * 0.015,
                          alignItems: 'center',
                        }}
                      >
                        <Icon
                          height={Dimensions.get('window').height * 0.05}
                          width={Dimensions.get('window').width * 0.1}
                        />
                        <View>
                          <Text
                            style={{
                              fontSize: Dimensions.get('window').height * 0.015,
                              fontWeight: WEIGHT.semi,
                              color: COLOR.black,
                            }}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: Dimensions.get('window').height * 0.013,
                              color: COLOR.black,
                              marginTop:
                                Dimensions.get('window').height * 0.005,
                            }}
                          >
                            {item.detail}
                          </Text>
                        </View>
                      </View>
                      <View>
                        {selected == index ? (
                          <Active
                            height={Dimensions.get('window').height * 0.025}
                          />
                        ) : (
                          <InActive
                            height={Dimensions.get('window').height * 0.025}
                          />
                        )}
                      </View>
                    </TouchableOpacity>

                    {index !== methods.length - 1 && (
                      <View
                        style={{
                          height: Dimensions.get('window').height * 0.001,
                          backgroundColor: COLOR.grey,
                          width: '90%',
                          alignSelf: 'center',
                          marginBottom: Dimensions.get('window').height * 0.015,
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          </View>

          {/* Saved Cards */}
          <View style={{ marginTop: Dimensions.get('window').height * 0.025 }}>
            <Text
              style={{
                fontSize: Dimensions.get('window').width * 0.045,
                fontWeight: WEIGHT.semi,
                color: COLOR.blue,
              }}
            >
              Saved Cards
            </Text>
            <View
              style={{
                marginTop: Dimensions.get('window').width * 0.01,
                backgroundColor: COLOR.white,
                borderRadius: spacing.hp10,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: Dimensions.get('window').height * 0.01,
                  marginHorizontal: Dimensions.get('window').width * 0.04,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    gap: spacing.wp15,
                    alignItems: 'center',
                  }}
                >
                  <MasterCard
                    height={Dimensions.get('window').height * 0.045}
                    width={Dimensions.get('window').width * 0.1}
                  />
                  <View>
                    <Text
                      style={{
                        fontSize: Dimensions.get('window').height * 0.015,
                        fontWeight: WEIGHT.semi,
                        color: COLOR.black,
                      }}
                    >
                      .... .... .... 1234
                    </Text>
                    <Text
                      style={{
                        fontSize: Dimensions.get('window').height * 0.013,
                        color: COLOR.black,
                        marginTop: spacing.hp6,
                      }}
                    >
                      Expires 04/28
                    </Text>
                  </View>
                </View>
                <View>
                  <InActive />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Top-up Button */}
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('SavedAddressess')}
            style={{
              backgroundColor: COLOR.blue,
              width: Dimensions.get('window').width * 0.86,
              height: Dimensions.get('window').height * 0.055,
              borderRadius: spacing.hp10,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: Dimensions.get('window').width * 0.045,
                fontWeight: WEIGHT.semi,
                color: COLOR.white,
              }}
            >
              Top-up
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RechargeWallet;
