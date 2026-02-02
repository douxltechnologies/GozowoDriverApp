import React, { useEffect, useState } from 'react';
import styles from '../../../styles';
import { Dimensions, Text, TouchableOpacity, View, Alert } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { COLOR } from '../../../utils/color';
import Whatsapp from '../../../assets/icons/whatsapp.svg';
import SMS from '../../../assets/icons/sms.svg';
import CountrySelect from 'react-native-country-select';
import DropDownArrow from '../../../assets/icons/dropdown-arrow.svg';
import AuthHeader from '../../../components/components/Headers/Auth/Header';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WEIGHT } from '../../../utils/weight';
import { button, fontSize, spacing } from '../../../utils/scaling';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { usePhoneLogin } from '../../../api/usePhoneLogin';
import AlertModal from '../../../components/components/Modals/AlertModal/AlertModal';
const PhoneVerification = ({ navigation, route }) => {
  const [selected, setSelected] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    flag: '🇺🇸',
    idd: { root: '+1' },
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const { phoneLogin, loading, error: errorPhoneLogin } = usePhoneLogin();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [title, setTitle] = useState('Error');
  const [message, setMessage] = useState('Someting went Wrong!');
  const [modalType,setModalType]=useState(null);

  // ✅ Phone validation function
  const validatePhoneNumber = () => {
    if (!phoneNumber.trim()) {
      setError('Phone number cannot be empty');
      return false;
    }
    if (parseInt(phoneNumber, 10) < 0) {
      setError('Invalid phone number');
      return false;
    }
    // Check if numeric and not negative
    if (!/^[0-9]+$/.test(phoneNumber)) {
      setError('Phone number must contain digits only');
      return false;
    }

    // Check length (7–15 is common international range)
    if (phoneNumber.length < 7 || phoneNumber.length > 15) {
      setError('Phone number must be between 7 and 15 digits');
      return false;
    }

    setError('');
    return true;
  };

  // ✅ Function to handle sending OTP By passing this function as functionality is not implemented
  // const handleSendCode = async () => {
  //   if (!validatePhoneNumber()) {
  //     return;
  //   }

  //   if (!selected) {
  //     Alert.alert('Please agree to the Terms & Conditions');
  //     return;
  //   }

  //   await phoneLogin(selectedCountry?.idd?.root + phoneNumber).then(result => {
  //     console.log(result);
  //     if (result?.status == true) {
  //       setModalType('success');
  //       setTitle('OTP Sent!');
  //       setMessage('OTP sent to phone number');
  //       setShowAlertModal(true);
  //       navigation.navigate('OTP',{deviceCode:result?.code});
  //     }
  //   });
  //   // If valid → navigate to OTP screen
  // };
  // useEffect(() => {
  //   if (errorPhoneLogin) {
  //     setModalType('error');
  //     setTitle(errorPhoneLogin.title);
  //     setMessage(errorPhoneLogin.message);
  //     setShowAlertModal(true);
  //   }
  // }, [errorPhoneLogin]);

  const handleSendCode=()=>{
    navigation.navigate('OTP');
  }

  return (
    <>
      <AlertModal
        modalType={modalType}
        title={title}
        message={message}
        showAlertModal={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      ></AlertModal>
      <SafeAreaProvider
        style={[styles.container, { backgroundColor: COLOR.fadeWhite }]}
      >
        <SafeAreaView>
          <View style={{ paddingHorizontal: spacing.wp15 }}>
            <AuthHeader navigation={navigation} route={route} />
          </View>

          <Text
            style={[
              styles.phoneDescription,
              {
                fontSize: fontSize.font14,
                marginLeft: spacing.wp15,
                marginTop: spacing.hp10,
              },
            ]}
          >
            Enter your phone number to continue
          </Text>

          <View>
            <View style={styles.phoneInputContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  gap: spacing.wp5,
                  marginTop: spacing.hp34,
                  paddingHorizontal: spacing.wp15,
                }}
              >
                <CountrySelect
                  onSelect={value => {
                    setSelectedCountry(value);
                  }}
                  onClose={() => setShowCountryPicker(false)}
                  visible={showCountryPicker}
                />

                <TouchableOpacity
                  style={[
                    styles.countrySelector,
                    {
                      paddingVertical: spacing.hp15,
                      borderRadius: spacing.hp10,
                      width: Dimensions.get('window').width * 0.235,
                      height: Dimensions.get('window').height * 0.045,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}
                  onPress={() => setShowCountryPicker(!showCountryPicker)}
                >
                  <Text
                    style={{
                      marginRight: spacing.wp15,
                      fontSize: fontSize.font14,
                      color: COLOR.black,
                    }}
                  >
                    {selectedCountry?.flag} {selectedCountry.idd.root}
                  </Text>
                  <DropDownArrow />
                </TouchableOpacity>

                <TextInput
                  keyboardType="numeric"
                  autoFocus={true}
                  style={[
                    styles.textInput,
                    {
                      width: Dimensions.get('window').width * 0.7,
                      height: Dimensions.get('window').height * 0.045,
                      backgroundColor: 'transparent',
                    },
                  ]}
                  activeOutlineColor={COLOR.blue}
                  label={'Mobile Number'}
                  outlineStyle={{ margin: 0, borderRadius: spacing.hp10 }}
                  mode="outlined"
                  value={phoneNumber}
                  onChangeText={text => {
                    setPhoneNumber(text);
                    setError('');
                  }}
                  onBlur={validatePhoneNumber}
                  error={!!error}
                />
              </View>

              {error ? (
                <Text
                  style={{
                    color: 'red',
                    fontSize: fontSize.font11,
                    marginLeft: spacing.wp15,
                    marginTop: spacing.hp6,
                  }}
                >
                  {error}
                </Text>
              ) : null}

              <View
                style={[
                  styles.checkboxContainer,
                  {
                    paddingHorizontal: spacing.wp15,
                    marginTop: spacing.hp15,
                    gap: spacing.wp5,
                    alignItems: 'center',
                  },
                ]}
              >
                <TouchableOpacity onPress={() => setSelected(!selected)}>
                  <Ionicons
                    color={selected ? COLOR.blue : COLOR.grey}
                    name={selected ? 'checkbox' : 'square-outline'}
                    size={Dimensions.get('window').height * 0.018}
                  ></Ionicons>
                </TouchableOpacity>

                <Text style={{ fontSize: fontSize.font11 }}>
                  By continuing, you agree to our
                </Text>
                <TouchableOpacity>
                  <Text
                    style={[
                      styles.termsconditions,
                      { fontSize: fontSize.font11, fontWeight: WEIGHT.semi },
                    ]}
                  >
                    Terms & Conditions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                marginTop: spacing.hp21,
                alignItems: 'center',
                gap: spacing.hp19,
              }}
            >
              <TouchableOpacity
                onPress={() => handleSendCode('Whatsapp')}
                style={[
                  styles.whatsappButton,
                  {
                    height: button.height,
                    width: button.width,
                    borderRadius: spacing.hp10,
                    gap: spacing.wp10,
                  },
                ]}
              >
                <Whatsapp />
                <Text
                  style={[
                    styles.whatsappText,
                    { fontSize: fontSize.font18, fontWeight: WEIGHT.semi },
                  ]}
                >
                  Send code via Whatsapp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSendCode('SMS')}
                style={[
                  styles.smsButton,
                  {
                    height: button.height,
                    width: button.width,
                    borderRadius: spacing.hp10,
                    gap: spacing.wp10,
                  },
                ]}
              >
               {loading?<ActivityIndicator color={COLOR.blue}></ActivityIndicator>:<>
                <SMS />
                <Text
                  style={[
                    styles.smsText,
                    { fontSize: fontSize.font18, fontWeight: WEIGHT.semi },
                  ]}
                >
                  Send code via SMS
                </Text></>}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

export default PhoneVerification;
