import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '../../../utils/color';
import { WEIGHT } from '../../../utils/weight';
import Back from '../../../assets/icons/back.svg';
import Download from '../../../assets/icons/download.svg';
import AddOutline from '../../../assets/icons/add-outline.svg';
import Incoming from '../../../assets/icons/incoming.svg';
import Spending from '../../../assets/icons/spending.svg';
import DatePicker from 'react-native-date-picker';
import DropDown from '../../../assets/icons/dropdown-arrow.svg';
import { button, fontSize, spacing } from '../../../utils/scaling';
import { useGetWallet } from '../../../api/useGetWallet';
import { useSelector } from 'react-redux';
import Card from '../../../assets/methods/card-generic.svg';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import styles from '../../../styles';
import { TextInput } from 'react-native-paper';
import Close from '../../../assets/icons/close-circle.svg';
import { useCreatePaymentIntent } from '../../../api/useCreatePaymentIntent';
import { useCreateEphemeralKey } from '../../../api/useCreateEphemeralKey';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

const Wallet = ({ navigation }) => {
  const TOKEN = useSelector(state => state?.token);
  const { getWallet, error, loading } = useGetWallet();
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [walletDetails, setWalletDetails] = useState(null);
  const sheetRef = useRef();
  const [focusedField, setFocusedField] = useState(null);
  const [amount, setAmount] = useState(0);
  const [paymentIntentData, setPaymentIntentData] = useState(null);
  const [ephemeralKey, setEphemeralKey] = useState(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {
    createPaymentIntent,
    error: buttonError,
    loading: buttonLoading,
  } = useCreatePaymentIntent();
  const {
    createEphemeralKey,
    error: errorKey,
    loading: loadingKey,
  } = useCreateEphemeralKey();
  // ✅ error states
  const [errors, setErrors] = useState({
    amount: '',
  });
  // const transactions = [
  //   {
  //     name: 'Booking LDR384B43 ',
  //     date: '10 Aug',
  //     time: '10:28 AM',
  //     via: 'Pickup - 1 Ton',
  //     credited: false,
  //     debited: true,
  //     amount: '-SAR 313',
  //     Icon: Card1,
  //   },
  //   {
  //     name: 'Recharge Wallet',
  //     date: '10 Aug',
  //     time: '10:28 AM',
  //     via: 'Google Pay',
  //     credited: true,
  //     debited: false,
  //     amount: '+SAR 1000',
  //     Icon: Card2,
  //   },
  //   {
  //     name: 'Recharge Wallet',
  //     date: '10 Aug',
  //     time: '10:28 AM',
  //     via: 'Apple Pay',
  //     credited: true,
  //     debited: false,
  //     amount: '+SAR 310',
  //     Icon: Card3,
  //   },
  // ];

  const paymentIntent = async () => {
    try {
      // 1. Create PaymentIntent
      const piResult = await createPaymentIntent(TOKEN, {
        amount: amount, // cents
        currency: 'usd',
        platform: Platform.OS,
      });

      if (!piResult?.success) return;

      // 2. Create Ephemeral Key
      const keyResult = await createEphemeralKey(TOKEN, {
        apiVersion: '2023-10-16',
      });

      if (!keyResult?.success) return;

      const ephemeralKey = JSON.parse(keyResult.data.ephemeralKey);

      // 3. Init Payment Sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'My App',
        customerId: piResult.data.customerId,
        customerEphemeralKeySecret: ephemeralKey.secret,
        paymentIntentClientSecret: piResult.data.clientSecret,
        allowsDelayedPaymentMethods: false,
      });

      setPaymentIntentData(piResult?.data);

      if (error) {
        console.log('Init error:', error);
        return;
      }

      // 4. Present Payment Sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        console.log('Payment failed:', presentError);
      } else {
        console.log('✅ Payment successful');
        sheetRef.current.dismiss();
      }
    } catch (err) {
      console.log('Stripe error:', err);
    }
  };

  useEffect(() => {
    const getWalletDetails = async () => {
      await getWallet(TOKEN).then(result => {
        setWalletDetails(result);
      });
    };
    getWalletDetails();
  }, [TOKEN]);
  console.log('Wallet:::::',walletDetails);
  // Format date as: Jan 6, 2026
  const formatDate = isoString => {
    const date = new Date(isoString);

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time as: 09:32 AM
  const formatTime = isoString => {
    const date = new Date(isoString);

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
console.log('TETS::::::::::::::::',paymentIntentData);
  return (
    <StripeProvider publishableKey={paymentIntentData?.publishableKey}>
      <TrueSheet
        ref={sheetRef}
        sizes={['auto']}
        // backgroundColor={'transparent'}
        grabber={false}
        // style={{height:'50%'}}
      >
        <View
          style={{
            width: '100%',
            alignItems: 'flex-end',
            paddingHorizontal: spacing?.wp15,
            paddingVertical: spacing?.hp10,
            justifyContent: 'flex-end',
            position: 'absolute',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              sheetRef?.current?.dismiss();
            }}
            style={{
              marginLeft: spacing.wp10,
            }}
          >
            <Close height={Dimensions.get('window').height * 0.04}></Close>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: spacing?.hp21,
            paddingVertical: spacing?.hp34,
          }}
        >
          <Text style={{ fontSize: fontSize?.font24, fontWeight: 'bold' }}>
            Enter Amount
          </Text>
          <TextInput
            mode="outlined"
            value={amount}
            onChangeText={text => {
              setAmount(text);
              if (text.trim()) setErrors(prev => ({ ...prev, amount: '' }));
            }}
            onFocus={() => setFocusedField('amount')}
            onBlur={() => setFocusedField(null)}
            label={
              <Text
                style={{
                  color:
                    focusedField === 'amount' || amount.length > 0
                      ? COLOR.blue
                      : COLOR.grey,
                }}
              >
                Amount
              </Text>
            }
            outlineColor={
              focusedField === 'amount' || amount.length > 0
                ? COLOR.blue
                : COLOR.grey
            }
            activeOutlineColor={COLOR.blue}
            placeholder={
              focusedField !== 'amount' && amount.length === 0
                ? 'e.g. John Doe'
                : ''
            }
            style={[
              styles.textInput,
              {
                height: Dimensions.get('window').height * 0.048,
                width: Dimensions.get('window').width * 0.9,
                backgroundColor: 'transparent',
              },
            ]}
            outlineStyle={{ margin: 0, borderRadius: spacing.hp10 }}
          />
          <TouchableOpacity
            onPress={() => {
              paymentIntent();
            }}
            disabled={buttonLoading}
            style={{
              width: Dimensions.get('window').width * 0.9,
              borderRadius: spacing.hp10,
              height: button.height,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: buttonLoading ? COLOR.grey : COLOR.blue,
              alignSelf: 'center',
            }}
          >
            {buttonLoading ? (
              <ActivityIndicator color={COLOR.white}></ActivityIndicator>
            ) : (
              <Text
                style={{
                  fontSize: fontSize.font18,
                  fontWeight: WEIGHT.semi,
                  color: COLOR.white,
                }}
              >
                Next
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </TrueSheet>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            display: 'flex',
            flex: 1,
            backgroundColor: COLOR.fadeWhite,
            paddingHorizontal: spacing.wp15,
            paddingTop:
              Platform.OS == 'ios'
                ? Dimensions.get('window').height * 0.001
                : Dimensions.get('window').height * 0.03,
          }}
        >
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: COLOR.grey,
                paddingBottom: spacing.hp15,
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
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
                    fontSize: fontSize.font24,
                    fontWeight: WEIGHT.semi,
                    color: COLOR.black,
                    marginLeft: spacing.wp15,
                  }}
                >
                  My Wallet
                </Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Download
                    height={Dimensions.get('window').height * 0.04}
                  ></Download>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <View
              style={{
                borderRadius: spacing.hp15,
                marginTop: spacing.hp21,
                backgroundColor: COLOR.blue,
                paddingHorizontal: Dimensions.get('window').width * 0.05,
                paddingVertical: spacing.hp15,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: fontSize.font18,
                      fontWeight: WEIGHT.semi,
                      color: COLOR.white,
                    }}
                  >
                    Available Balance
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSize.font40,
                      fontWeight: WEIGHT.bold,
                      color: COLOR.white,
                      marginTop: spacing.hp6,
                    }}
                  >
                    SAR {walletDetails?.balance}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      sheetRef.current.present();
                    }}
                    style={{
                      paddingVertical: spacing.hp10,
                      paddingHorizontal: spacing.wp15,
                      borderRadius: spacing.hp10,
                      backgroundColor: COLOR.whiteOpacity,
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'row',
                      gap: spacing.wp15,
                    }}
                  >
                    <AddOutline></AddOutline>
                    <Text
                      style={{
                        fontSize: fontSize.font16,
                        fontWeight: WEIGHT.semi,
                        color: COLOR.white,
                      }}
                    >
                      Recharge
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: spacing.hp15,
                }}
              >
                <View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.wp5,
                    }}
                  >
                    <Incoming></Incoming>
                    <Text
                      style={{ fontSize: fontSize.font14, color: COLOR.white }}
                    >
                      Total Incoming
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: fontSize.font18,
                        fontWeight: WEIGHT.semi,
                        color: COLOR.white,
                      }}
                    >
                      SAR {walletDetails?.totalIncoming}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.wp5,
                    }}
                  >
                    <Spending></Spending>
                    <Text
                      style={{ fontSize: fontSize.font14, color: COLOR.white }}
                    >
                      Total Spending
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: fontSize.font18,
                        fontWeight: WEIGHT.semi,
                        color: COLOR.white,
                      }}
                    >
                      SAR {walletDetails?.totalSpending}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginTop: spacing.hp21, alignItems: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => {
                setShowDate(!showDate);
              }}
              style={{
                paddingVertical: spacing.hp6,
                paddingHorizontal: spacing.wp15,
                borderRadius: spacing.hp6,
                backgroundColor: COLOR.fadeBlue,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.wp10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.font16,
                  fontWeight: WEIGHT.semi,
                  color: COLOR.blue,
                  gap: spacing.wp10,
                }}
              >
                {date.getMonth()} {date.getFullYear()}
              </Text>
              <DropDown></DropDown>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={showDate}
              date={date}
              onConfirm={date => {
                setShowDate(false);
                setDate(date);
              }}
              onCancel={() => {
                setShowDate(!showDate);
              }}
            />
          </View>
          <View
            style={{
              paddingHorizontal: spacing.wp15,
              paddingVertical: spacing.hp21,
              backgroundColor: COLOR.white,
              borderRadius: spacing.hp21,
              marginTop: spacing.hp21,
            }}
          >
            <Text
              style={{ fontSize: fontSize.font18, fontWeight: WEIGHT.semi }}
            >
              Transaction History
            </Text>
            <FlatList
              data={walletDetails?.transactions}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginTop: index == 0 ? spacing.hp21 : spacing.hp15,
                      borderBottomWidth: 1,
                      borderColor: COLOR.grey,
                      paddingBottom: spacing.hp15,
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      {item.paymentMethod == 'Card' ? (
                        <Card
                          height={Dimensions.get('window').height * 0.045}
                          width={Dimensions.get('window').width * 0.1}
                        ></Card>
                      ) : (
                        <></>
                      )}
                      <View style={{ marginLeft: spacing.wp10 }}>
                        <Text
                          style={{
                            fontSize: fontSize.font18,
                            fontWeight: WEIGHT.semi,
                            color: COLOR.black,
                          }}
                        >
                          {item?.transferReason}
                        </Text>
                        <Text
                          style={{
                            marginTop: spacing.hp6,
                            fontSize: fontSize.font14,
                            color: COLOR.black,
                          }}
                        >
                          {item?.paymentMethod}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Text
                        style={{ fontSize: fontSize.font11, color: COLOR.grey }}
                      >
                        {formatDate(item?.transactionDate)} -{' '}
                        {formatTime(item?.transactionDate)}
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSize.font18,
                          fontWeight: WEIGHT.semi,
                          color:
                            item?.transactionType == 'Debit'
                              ? COLOR.red
                              : COLOR.blue,
                        }}
                      >
                        {item?.transactionType == 'Debit' ? '-' : '+'} SAR{' '}
                        {item?.amount}
                      </Text>
                    </View>
                  </View>
                );
              }}
            ></FlatList>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </StripeProvider>
  );
};
export default Wallet;
