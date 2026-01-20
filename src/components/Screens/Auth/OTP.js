import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../../styles';
import { OtpInput } from 'react-native-otp-entry';
import { COLOR } from '../../../utils/color';
import { scale, verticalScale } from 'react-native-size-matters';
import AuthHeader from '../../../components/components/Headers/Auth/Header';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WEIGHT } from '../../../utils/weight';
import { button, fontSize, spacing } from '../../../utils/scaling';
import { useEffect, useState } from 'react';
import { useVerifyOTP } from '../../../api/useVerifyOTP';
import DeviceInfo from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserDetails } from '../../../store/actions';
import { ActivityIndicator } from 'react-native-paper';
import AlertModal from '../../components/Modals/AlertModal/AlertModal';
import { useGetProfile } from '../../../api/useGetProfile';
import { useVerifyEmailOTP } from '../../../api/useVerifyEmailOTP';
import messaging from '@react-native-firebase/messaging';
import { DEVICE_CODE } from '../../../utils/keys';

const OTP = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [deviceId, setDeviceId] = useState('');
  const { verifyOTP, loading, error } = useVerifyOTP();
  const {
    verifyEmailOTP,
    loading: loadingEmailOTP,
    error: errorEmailOTP,
  } = useVerifyEmailOTP();
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [title, setTitle] = useState('Error');
  const [message, setMessage] = useState('Something went wrong!');
  const [modalType, setModalType] = useState(null);
  const TOKEN = useSelector(state => state?.token);
  const [fcmToken,setFcmToken]=useState(null);

  const {
    getProfileDetails,
    loading: loadingProfile,
    error: errorProfile,
  } = useGetProfile();

  // Check if it's email verification
  const isEmailVerification = route?.params?.emailVerification === true;
  const userContact = route?.params?.contact || '+971******00'; // fallback phone
  const maskedEmail = route?.params?.email
    ? route.params.email.replace(
        /(.{2})(.*)(?=@)/,
        (_, a, b) => a + '*'.repeat(b.length),
      )
    : 'your email';

  // Fetch Device ID
  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setDeviceId(id);
      console.log('Device ID:', id);
    };
    fetchDeviceId();
  }, []);

  // Handle Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.trim() === '') {
      setTitle('Invalid OTP');
      setMessage('Please enter the OTP before verifying.');
      setShowAlertModal(true);
      return;
    }

    // You can pass additional param like isEmailVerification if API supports it
    await verifyOTP(
      DEVICE_CODE,
      otp,
      deviceId,
      fcmToken,
      rememberMe,
    ).then(async result => {
      if (result?.status === true) {
        dispatch(setToken(result?.token));
        await getProfileDetails(result?.token).then(result1 => {
          if (result1?.status == true) {
            if (result1?.isSkipped == true) {
              dispatch(setUserDetails(result1));
              navigation.navigate('BottomTab');
            } else {
              navigation.navigate('Complete');
            }
          }
        });
      } else {
        setTitle('Error');
        setMessage(
          result?.message || 'Invalid or expired OTP. Please try again.',
        );
        setShowAlertModal(true);
      }
    });
  };
  const handleVerifyEmailOtp = async () => {
    console.log(TOKEN);
    console.log(otp);
    if (!otp || otp.trim() === '') {
      setTitle('Invalid OTP');
      setMessage('Please enter the OTP before verifying.');
      setShowAlertModal(true);
      return;
    }

    // You can pass additional param like isEmailVerification if API supports it
    await verifyEmailOTP(TOKEN, otp).then(async result => {
      console.log('I am here', result);
      if (result?.success === true) {
        setModalType('success');
        setTitle('Verification Completed!');
        setMessage(result.message);
        setShowAlertModal(true);
        await getProfileDetails(TOKEN).then(result1 => {
          if (result1?.status == true) {
            dispatch(setUserDetails(result1));
            navigation.goBack();
          }
        });
      } else {
        setTitle('Error');
        setMessage(
          result?.message || 'Invalid or expired OTP. Please try again.',
        );
        setShowAlertModal(true);
      }
    });
  };

  // Show error modal if API returns an error
  useEffect(() => {
    if (error != null) {
      setModalType('error');
      setTitle(error?.title || 'Error');
      setMessage(error?.message || 'Something went wrong!');
      setShowAlertModal(true);
    }
  }, [error]);
  useEffect(() => {
    if (errorEmailOTP != null) {
      setModalType('error');
      setTitle(errorEmailOTP?.title || 'Error');
      setMessage(errorEmailOTP?.message || 'Something went wrong!');
      setShowAlertModal(true);
    }
  }, [errorEmailOTP]);
async function getFcmToken() {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) return;
  }

  await messaging().registerDeviceForRemoteMessages();

  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  setFcmToken(token);
}
  useEffect(() => {
    getFcmToken();
  }, [TOKEN]);
  return (
    <>
      <AlertModal
        modalType={modalType}
        title={title}
        message={message}
        showAlertModal={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      />

      <SafeAreaProvider style={styles.container}>
        <SafeAreaView>
          <View style={{ paddingHorizontal: spacing.wp15 }}>
            <AuthHeader navigation={navigation} route={route} />
          </View>

          {/* --- Change message dynamically --- */}
          <Text
            style={[
              styles.phoneDescription,
              {
                fontSize: fontSize.font14,
                marginTop: spacing.hp10,
                marginLeft: Dimensions.get('window').width * 0.093,
              },
            ]}
          >
            {isEmailVerification
              ? `We have sent a code to ${maskedEmail}`
              : `We have sent a code on ${userContact}`}
          </Text>

          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingHorizontal: Dimensions.get('window').width * 0.093,
            }}
          >
            <OtpInput
              numberOfDigits={6}
              keyboardType="numeric"
              onTextChange={value => {
                const numericValue = value.replace(/[^0-9]/g, '');
                setOtp(numericValue);
              }}
              theme={{
                pinCodeTextStyle: { color: COLOR.black },
                pinCodeContainerStyle: {
                  borderColor: COLOR.grey,
                  height: button.height,
                  width: Dimensions.get('window').width * 0.12,
                  marginTop: spacing.hp34,
                },
                focusedPinCodeContainerStyle: { borderColor: COLOR.grey },
                filledPinCodeContainerStyle: { borderColor: COLOR.grey },
                focusStickStyle: { backgroundColor: COLOR.black },
              }}
            />
          </View>

          <TouchableOpacity
            disabled={otp.length < 6 || loading}
            onPress={
              route?.params?.emailVerification
                ? handleVerifyEmailOtp
                : handleVerifyOtp
            }
            style={{
              backgroundColor:
                otp.length < 6 || loading ? COLOR.grey : COLOR.blue,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: spacing.hp34,
              height: button.height,
              width: button.width,
              borderRadius: spacing.hp10,
              alignSelf: 'center',
              opacity: otp.length < 6 || loading ? 0.6 : 1,
            }}
          >
            {loading || loadingEmailOTP ? (
              <ActivityIndicator color={COLOR.white} />
            ) : (
              <Text
                style={{
                  fontSize: fontSize.font18,
                  color: COLOR.white,
                  fontWeight: WEIGHT.semi,
                }}
              >
                Verify
              </Text>
            )}
          </TouchableOpacity>

          {/* --- Dynamic Resend message --- */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: spacing.wp5,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: spacing.hp15,
            }}
          >
            <Text style={{ color: COLOR.black, fontSize: fontSize.font14 }}>
              Didn’t receive the {isEmailVerification ? 'email' : 'OTP'}?
            </Text>
            <Text
              style={{
                color: COLOR.blue,
                fontSize: fontSize.font14,
                fontWeight: WEIGHT.semi,
              }}
            >
              Resend OTP in 20 Seconds
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

export default OTP;
