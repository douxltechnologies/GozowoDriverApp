import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { ProgressBar, TextInput } from 'react-native-paper';
import { COLOR } from '../../../utils/color';
import Edit from '../../../assets/icons/edit.svg';
import styles from '../../../styles';
import CountrySelect from 'react-native-country-select';
import DropDownArrow from '../../../assets/icons/dropdown-arrow.svg';
import Calendar from '../../../assets/icons/calendar.svg';
import DropdownComponent from '../../components/DropDowns/DropdownComponent';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AuthHeader from '../../../components/components/Headers/Auth/Header';
import { WEIGHT } from '../../../utils/weight';
import { button, fontSize, spacing } from '../../../utils/scaling';
import { useNationality } from '../../../api/useNationality';
import { useDispatch, useSelector } from 'react-redux';
import { useGender } from '../../../api/useGender';
import { useSaveUserProfile } from '../../../api/useSaveUserProfile';
import AlertModal from '../../components/Modals/AlertModal/AlertModal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker'
import { useVerifyEmail } from '../../../api/useVerifyEmail';
import { setUserDetails } from '../../../store/actions';
import { useGetProfile } from '../../../api/useGetProfile';

const Complete = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const TOKEN = useSelector(state => state?.token);
  const PROFILE = useSelector(state => state?.user);
  const { fetchNationality } = useNationality();
  const { fetchGender } = useGender();
  const { saveUserProfile, loading, error } = useSaveUserProfile();
  const {
    verifyEmail,
    loading: verifyLoading,
    error: verifyError,
  } = useVerifyEmail();

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const dobRef = useRef(null);
  const emailRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState({
    flag: '🇺🇸',
    idd: { root: '+1' },
  });

  const [genderValue, setGenderValue] = useState(null);
  const [nationalityValue, setNationalityValue] = useState(null);

  const [name, setName] = useState('');
  const [nameFocused, setNameFocused] = useState(false);

  const [number, setNumber] = useState('');
  const [numberFocused, setNumberFocused] = useState(false);

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [dob, setDOB] = useState('');
  const [dobFocused, setDobFocused] = useState(false);

  const [nationality, setNationality] = useState([]);
  const [gender, setGender] = useState([]);

  const [profilePicture, setProfilePicture] = useState(null);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [title, setTitle] = useState('Error');
  const [message, setMessage] = useState('Something went wrong!');
  const [modalType, setModalType] = useState(null);
  const [profilePercentage, setProfilePercentage] = useState(0);
  const [showDate, setShowDate] = useState(false);
  const [backendProfilePercentage, setBackendProfilePercentage] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const {
    getProfileDetails,
    loading: loadingProfile,
    error: errorProfile,
  } = useGetProfile();

  const getColor = (focused, value) =>
    focused || (value && value.length > 0) ? COLOR.blue : COLOR.grey;

  const handleOtherFocus = () => {
    if (dobRef.current) dobRef.current.blur();
    if (emailRef.current) emailRef.current.blur();
    setDobFocused(false);
    setEmailFocused(false);
  };

  const fetchNationalities = async () => {
    await fetchNationality(TOKEN).then(result => {
      if (result?.status == true) {
        setNationality(result?.result);
      }
    });
  };

  const fetchGenders = async () => {
    await fetchGender(TOKEN).then(result => {
      if (result?.status == true) {
        setGender(result?.result);
      }
    });
  };

  const openImagePicker = () => {
    Alert.alert('Select Option', 'Choose an image source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.7,
      saveToPhotos: true,
    });
    if (!result.didCancel && result.assets?.length > 0) {
      setProfilePicture(result.assets[0]);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
    });
    if (!result.didCancel && result.assets?.length > 0) {
      setProfilePicture(result.assets[0]);
    }
  };

  const completeProfile = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    } else {
      setEmailError('');
    }

    await saveUserProfile(TOKEN, {
      name: name,
      email: email,
      phone:
        selectedCountry.flag + ':' + selectedCountry.idd.root + ':' + number,
      dob: dob,
      nationalityId: nationalityValue?.value,
      genderId: genderValue?.value,
      isSkipped: skipped,
      profileImage: profilePicture
        ? {
            uri: profilePicture.uri,
            type: profilePicture.type,
            name: profilePicture.fileName || 'profile.jpg',
          }
        : null,
    }).then(async result => {
      if (result?.data?.status) {
        setModalType('success');
        setTitle('Profile Saved!');
        setMessage('Profile Saved Successfully!');
        setShowAlertModal(!showAlertModal);
        await fetchUserProfile();
        navigation.goBack();
      }
    });
  };
  const skipProfile = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    } else {
      setEmailError('');
    }

    await saveUserProfile(TOKEN, {
      name: PROFILE?.name,
      email: PROFILE?.email,
      phone: PROFILE?.phone,
      dob: PROFILE?.dob,
      nationalityId: PROFILE?.nationality?.id,
      genderId: PROFILE?.gender?.id,
      isSkipped: true,
      profileImage: PROFILE?.imageUrl,
    }).then(result => {
      if (result?.data?.status) {
        navigation.navigate('DashboardStack');
      }
    });
  };

  const handleVerifyEmail = async () => {
    await verifyEmail(TOKEN, email).then(result => {
      setModalType('success');
      setTitle('Verify Email');
      setMessage(result.message);
      setShowAlertModal(true);
      navigation.navigate('OTP', { emailVerification: true });
    });
  };

  useEffect(() => {
    fetchNationalities();
    fetchGenders();
  }, [TOKEN]);

  useEffect(() => {
    if (error != null) {
      setModalType('error');
      setTitle(error?.title || 'Error');
      setMessage(error?.message || 'Something went wrong!');
      setShowAlertModal(true);
    }
  }, [error]);

  const fetchUserProfile = async () => {
    await getProfileDetails(TOKEN).then(result => {
      if (result?.status == true) {
        dispatch(setUserDetails(result));
      }
    });
  };

  useEffect(() => {
    if (route?.params?.action == 'edit') {
      setName(PROFILE?.name);
      setNumber(PROFILE?.phone.split(':')[2]);
      setEmail(PROFILE?.email);
      setDOB(PROFILE?.dob);
      setNationalityValue({
        value: PROFILE?.nationality?.id,
        label: PROFILE?.nationality?.label,
      });
      setGenderValue({
        value: PROFILE?.gender?.id,
        label: PROFILE?.gender?.label,
      });
      setProfilePicture(PROFILE?.imageUrl);
      setSelectedCountry({
        flag: PROFILE?.phone.split(':')[0],
        idd: { root: PROFILE?.phone.split(':')[1] },
      });
      setBackendProfilePercentage(Number(PROFILE?.profilePercentage) || 0);
    }
  }, [route?.params?.action]);

  const calculateProfileCompletion = () => {
    let filledFields = 0;
    if (profilePicture) filledFields++;
    if (name?.trim()) filledFields++;
    if (number?.trim()) filledFields++;
    if (email?.trim()) filledFields++;
    if (dob) filledFields++;
    if (nationalityValue) filledFields++;
    if (genderValue) filledFields++;

    const percentage = 20 + filledFields * (80 / 7);
    return Math.min(percentage, 100);
  };

  const isAnyFieldFilled = () => {
    return (
      name?.trim() !== '' ||
      number?.trim() !== '' ||
      email?.trim() !== '' ||
      dob?.trim() !== '' ||
      nationalityValue !== null ||
      genderValue !== null ||
      profilePicture !== null
    );
  };

  useEffect(() => {
    const newPercentage = calculateProfileCompletion();
    if (!isAnyFieldFilled()) {
      setProfilePercentage(backendProfilePercentage);
    } else {
      setProfilePercentage(newPercentage);
    }
  }, [
    name,
    dob,
    email,
    number,
    profilePicture,
    genderValue,
    nationalityValue,
    backendProfilePercentage,
  ]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // ✅ New state

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
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
        <SafeAreaView
          style={{
            flex: 1,
            marginHorizontal: spacing.wp15,
            justifyContent: 'space-between',
            paddingBottom: spacing.hp50,
          }}
        >
          <AuthHeader navigation={navigation} route={route} />

          {/* ✅ Keyboard-aware scrolling only when keyboard is open */}
          <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
            <ScrollView
              scrollEnabled={isKeyboardVisible ? true : false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
              }}
            >
              {/* Progress */}
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        marginTop: spacing.hp15,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: spacing.wp15,
                      }}
                    >
                      <ProgressBar
                        style={{
                          backgroundColor: COLOR.grey,
                          height: spacing.hp10,
                          borderRadius: Dimensions.get('window').height * 0.08,
                          width:
                            Number(profilePercentage).toFixed(0).length == 3
                              ? Dimensions.get('window').width * 0.79
                              : Number(profilePercentage).toFixed(0).length == 2
                              ? Dimensions.get('window').width * 0.815
                              : Dimensions.get('window').width * 0.85,
                        }}
                        progress={profilePercentage / 100}
                        color={COLOR.blue}
                      />
                      <Text
                        style={{
                          fontSize: fontSize.font18,
                          fontWeight: WEIGHT.semi,
                        }}
                      >
                        {Number(profilePercentage).toFixed(0)} %
                      </Text>
                    </View>
                  </View>

                  {/* Profile */}
                  <View
                    style={{
                      alignItems: 'flex-start',
                      marginTop: spacing.hp34,
                    }}
                  >
                    <View>
                      {route?.params?.action == 'edit' ? (
                        <Image
                          style={{height: 80, width: 80, borderRadius:Dimensions.get('window').height*0.045}}
                          source={{
                            uri:
                              profilePicture?.uri != null
                                ? profilePicture?.uri
                                : profilePicture,
                          }}
                        />
                      ) : (
                        <Image
                          style={{ height: 80, width: 80, borderRadius:Dimensions.get('window').height*0.045}}
                          source={
                            profilePicture != null
                              ? profilePicture
                              : require('../../../assets/Images/logo/place-holder.jpg')
                          }
                        />
                      )}
                      <TouchableOpacity
                        onPress={openImagePicker}
                        style={{ position: 'absolute', right: 0, bottom: 0 }}
                      >
                        <Edit />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        color: COLOR.blue,
                        fontSize: fontSize.font11,
                        fontWeight: WEIGHT.semi,
                        marginTop: spacing.hp10,
                      }}
                    >
                      Joined, 25 July 2025
                    </Text>
                  </View>

                  {/* Form Header */}
                  <Text
                    style={{
                      fontSize: fontSize.font18,
                      fontWeight: WEIGHT.semi,
                      color: COLOR.blue,
                      marginTop: spacing.hp15,
                    }}
                  >
                    Enter Your Details
                  </Text>
                </View>

                <View style={{ justifyContent: 'space-between', flex: 1 }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      marginTop: spacing.hp10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLOR.white,
                        borderRadius: spacing.hp10,
                        alignItems: 'center',
                        paddingTop: spacing.hp21,
                        paddingBottom: spacing.hp21,
                        paddingHorizontal: spacing.wp15,
                      }}
                    >
                      {/* Name */}
                      {!nameFocused && name?.length === 0 && (
                        <Text
                          style={{
                            position: 'absolute',
                            left: spacing.wp15 + 13,
                            top: spacing.hp15 + 3,
                            color: COLOR.grey,
                            backgroundColor: COLOR.white,
                            fontSize: fontSize.font11,
                            zIndex: 1,
                            paddingHorizontal: 4,
                          }}
                        >
                          Name
                        </Text>
                      )}
                      <TextInput
                        value={name}
                        onChangeText={setName}
                        onFocus={() => setNameFocused(true)}
                        onBlur={() => setNameFocused(false)}
                        style={[
                          styles.textInput,
                          {
                            width: '100%',
                            height: Dimensions.get('window').height * 0.045,
                          },
                        ]}
                        activeOutlineColor={getColor(nameFocused, name)}
                        outlineColor={getColor(nameFocused, name)}
                        outlineStyle={{
                          borderRadius: spacing.hp10,
                          borderWidth: 1.5,
                          borderColor: getColor(nameFocused, name),
                        }}
                        label={
                          <Text style={{ color: getColor(nameFocused, name) }}>
                            Name
                          </Text>
                        }
                        mode="outlined"
                      />

                      {/* Phone */}
                      <View style={styles.phoneInputContainer}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            gap: spacing.wp5,
                            justifyContent: 'center',
                            marginTop: spacing.hp21,
                          }}
                        >
                          <CountrySelect
                            onSelect={value => {
                              setSelectedCountry(value);
                            }}
                            onClose={() => {
                              setShowCountryPicker(false);
                            }}
                            visible={showCountryPicker}
                          ></CountrySelect>
                          <TouchableOpacity
                            style={[
                              styles.countrySelector,
                              {
                                paddingVertical: spacing.hp15,
                                borderRadius: spacing.hp10,
                                width: Dimensions.get('window').width * 0.25,
                                height: Dimensions.get('window').height * 0.045,
                                alignItems: 'center',
                                justifyContent: 'center',
                              },
                            ]}
                            onPress={() => {
                              setShowCountryPicker(!showCountryPicker);
                            }}
                          >
                            <Text
                              style={{
                                marginRight: spacing.wp15,
                                columnGap: spacing.wp15,
                                fontSize: fontSize.font14,
                                color: COLOR.black,
                              }}
                            >
                              {selectedCountry?.flag} {selectedCountry.idd.root}
                            </Text>
                            <DropDownArrow />
                          </TouchableOpacity>
                          <View>
                            {!numberFocused && number?.length === 0 && (
                              <Text
                                style={{
                                  position: 'absolute',
                                  left: 16.5,
                                  top: -spacing.hp6 + 5,
                                  color: COLOR.grey,
                                  backgroundColor: COLOR.white,
                                  fontSize: fontSize.font11,
                                  zIndex: 1,
                                }}
                              >
                                Mobile Number
                              </Text>
                            )}

                            <TextInput
                              keyboardType={'numeric'}
                              value={number}
                              onChangeText={setNumber}
                              onFocus={() => setNumberFocused(true)}
                              onBlur={() => setNumberFocused(false)}
                              style={[
                                styles.textInput,
                                {
                                  width: Dimensions.get('window').width * 0.64,
                                  height:
                                    Dimensions.get('window').height * 0.045,
                                  backgroundColor: 'transparent',
                                },
                              ]}
                              activeOutlineColor={getColor(
                                numberFocused,
                                number,
                              )}
                              outlineColor={getColor(numberFocused, number)}
                              outlineStyle={{
                                borderRadius: spacing.hp10,
                                borderWidth: 1.5,
                                borderColor: getColor(numberFocused, number),
                              }}
                              label={
                                <Text
                                  style={{
                                    color: getColor(numberFocused, number),
                                  }}
                                >
                                  Mobile Number
                                </Text>
                              }
                              mode="outlined"
                            />
                          </View>
                        </View>
                      </View>

                      {/* Email */}
                      <View
                        style={{
                          position: 'relative',
                          marginTop: spacing.hp21,
                          width: '100%',
                        }}
                      >
                        {!emailFocused && email?.length === 0 && (
                          <Text
                            style={{
                              position: 'absolute',
                              left: spacing.wp15 + 3,
                              top: -spacing.hp6 + 4,
                              color: COLOR.grey,
                              backgroundColor: COLOR.white,
                              fontSize: fontSize.font11,
                              zIndex: 1,
                              paddingHorizontal: 4,
                            }}
                          >
                            Email Address
                          </Text>
                        )}

                        <TextInput
                          ref={emailRef}
                          value={email}
                          onChangeText={text => {
                            setEmail(text);
                            setEmailError(''); // reset error when typing
                          }}
                          onFocus={() => setEmailFocused(true)}
                          onBlur={() => setEmailFocused(false)}
                          style={[
                            styles.textInput,
                            {
                              height: Dimensions.get('window').height * 0.045,
                              backgroundColor: 'transparent',
                              paddingRight:
                                Dimensions.get('window').width * 0.2,
                            },
                          ]}
                          activeOutlineColor={getColor(emailFocused, email)}
                          outlineColor={
                            emailError ? 'red' : getColor(emailFocused, email)
                          } // ✅ highlight red if error
                          outlineStyle={{
                            borderRadius: spacing.hp10,
                            borderWidth: 1.5,
                            borderColor: emailError
                              ? 'red'
                              : getColor(emailFocused, email),
                          }}
                          label={
                            <Text
                              style={{ color: getColor(emailFocused, email) }}
                            >
                              {emailFocused
                                ? 'Email Address'
                                : email.length != 0
                                ? 'Email Address'
                                : 'abc@gmail.com'}
                            </Text>
                          }
                          mode="outlined"
                        />
                        <TouchableOpacity
                          onPress={handleVerifyEmail}
                          style={{
                            position: 'absolute',
                            right: spacing.wp15,
                            top: Dimensions.get('window').height * 0.016,
                            backgroundColor: PROFILE?.isEmailVerified
                              ? COLOR.fadeGreen
                              : COLOR.fadeBlue,
                            borderRadius:
                              Dimensions.get('window').height * 0.004,
                            width: Dimensions.get('window').width * 0.18,
                            height: Dimensions.get('window').height * 0.028,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              color: PROFILE?.isEmailVerified
                                ? COLOR.darkGreen
                                : COLOR.blue,
                              fontSize: fontSize.font14,
                              fontWeight: WEIGHT.semi,
                            }}
                          >
                            {PROFILE?.isEmailVerified ? 'Verified!' : 'Verify'}
                          </Text>
                        </TouchableOpacity>

                        {/* ✅ Email Error Message */}
                        {emailError ? (
                          <Text
                            style={{
                              color: 'red',
                              fontSize: fontSize.font12,
                              marginTop: 5,
                              marginLeft: spacing.wp10,
                            }}
                          >
                            {emailError}
                          </Text>
                        ) : null}
                      </View>

                      <DatePicker
                        mode="date"
                        isVisible={showDate}
                        onConfirm={date => {
                          console.log(date);
                          setShowDate(false);
                          setDOB(
                            date.getDate() +
                              '/' +
                              (date.getMonth() + 1) + // ✅ month +1 fix
                              '/' +
                              date.getFullYear(),
                          );
                        }}
                        onCancel={() => {
                          setShowDate(false);
                        }}
                      />

                      {/* DOB */}
                      <View
                        style={{
                          position: 'relative',
                          marginTop: spacing.hp21,
                          width: '100%',
                        }}
                      >
                        {!dobFocused && dob?.length === 0 && (
                          <Text
                            style={{
                              position: 'absolute',
                              left: spacing.wp15 + 3,
                              top: -spacing.hp6 + 4,
                              color: COLOR.grey,
                              backgroundColor: COLOR.white,
                              fontSize: fontSize.font11,
                              zIndex: 1,
                              paddingHorizontal: 4,
                            }}
                          >
                            Date of Birth
                          </Text>
                        )}

                        <TextInput
                          value={dob}
                          onChangeText={dob => {
                            setDOB(dob);
                          }}
                          ref={dobRef}
                          onFocus={() => setDobFocused(true)}
                          onBlur={() => setDobFocused(false)}
                          style={[
                            styles.textInput,
                            {
                              height: Dimensions.get('window').height * 0.045,
                              backgroundColor: 'transparent',
                            },
                          ]}
                          activeOutlineColor={getColor(dobFocused, dob)}
                          outlineColor={getColor(dobFocused, dob)}
                          outlineStyle={{
                            borderRadius: spacing.hp10,
                            borderWidth: 1.5,
                            borderColor: getColor(dobFocused, dob),
                          }}
                          label={
                            <Text style={{ color: getColor(dobFocused, dob) }}>
                              {dobFocused
                                ? 'Date of Birth'
                                : dob?.length != 0
                                ? 'Date of Birth'
                                : 'DD/MM/YYYY'}
                            </Text>
                          }
                          mode="outlined"
                        ></TextInput>
                        <TouchableOpacity
                          onPress={() => {
                            setShowDate(!showDate);
                          }}
                          style={{
                            position: 'absolute',
                            right: spacing.wp10,
                            top: spacing.hp10 + 6,
                          }}
                        >
                          <Calendar />
                        </TouchableOpacity>
                      </View>

                      {/* Dropdowns */}
                      <View style={{ width: '100%' }}>
                        <Text
                          style={{
                            color: COLOR.grey,
                            backgroundColor: COLOR.white,
                            fontSize: fontSize.font11,
                            position: 'absolute',
                            left: spacing.wp15 + 6,
                            top: Dimensions.get('window').height * 0.009,
                            zIndex: 1,
                          }}
                        >
                          Nationality
                        </Text>
                        <DropdownComponent
                          nationalityValue={nationalityValue}
                          setNationalityValue={setNationalityValue}
                          data={nationality?.map(item => ({
                            label: item.nationality,
                            value: item.id,
                          }))}
                          handleOtherFocus={handleOtherFocus}
                          setNumberFocused={setNumberFocused}
                          setDobFocused={setDobFocused}
                          setEmailFocused={setEmailFocused}
                          setNameFocused={setNameFocused}
                          title="Nationality"
                        />
                      </View>

                      <View style={{ width: '100%' }}>
                        <Text
                          style={{
                            color: COLOR.grey,
                            backgroundColor: COLOR.white,
                            fontSize: fontSize.font11,
                            position: 'absolute',
                            left: spacing.wp15 + 6,
                            top: Dimensions.get('window').height * 0.009,
                            zIndex: 1,
                          }}
                        >
                          Gender
                        </Text>
                        <DropdownComponent
                          genderValue={genderValue}
                          setGenderValue={setGenderValue}
                          data={gender?.map(item => ({
                            label: item.gender,
                            value: item.id,
                          }))}
                          handleOtherFocus={handleOtherFocus}
                          setNumberFocused={setNumberFocused}
                          setDobFocused={setDobFocused}
                          setEmailFocused={setEmailFocused}
                          setNameFocused={setNameFocused}
                          title="Gender"
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Buttons */}
                <View
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginVertical: isKeyboardVisible ? spacing.hp50 : 0,
                  }}
                >
                  <TouchableOpacity
                    onPress={completeProfile}
                    disabled={!isAnyFieldFilled() || loading}
                    style={{
                      backgroundColor: isAnyFieldFilled()
                        ? loading
                          ? COLOR.grey
                          : COLOR.blue
                        : COLOR.grey,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      width: button.width,
                      height: button.height,
                      borderRadius: spacing.hp10,
                      opacity: isAnyFieldFilled() ? 1 : 0.6,
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLOR.white} />
                    ) : (
                      <Text
                        style={{
                          color: COLOR.white,
                          fontWeight: WEIGHT.semi,
                          fontSize: fontSize.font18,
                        }}
                      >
                        {route?.params?.action == 'edit'
                          ? 'Update Changes'
                          : 'Save Changes'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {route?.params?.action == 'edit' ? null : (
                    <TouchableOpacity
                      onPress={() => {
                        skipProfile();
                      }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: spacing.hp21,
                      }}
                    >
                      <Text
                        style={{
                          color: COLOR.blue,
                          textDecorationLine: 'underline',
                          fontSize: fontSize.font18,
                          fontWeight: WEIGHT.semi,
                        }}
                      >
                        Skip for Now
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

export default Complete;
