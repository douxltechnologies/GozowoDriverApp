import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/components/Stack/AuthStack/AuthStack';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  useEffect(() => {
    requestLocationPermission();
  }, []);
  async function getFcmToken() {
    // Request permission (required for iOS, optional for Android)
    await messaging().requestPermission();

    const token = await messaging().getToken();
    console.log('FCM Token:', token);

    return token;
  }
  useEffect(() => {
    getFcmToken();
  }, []);
  // 🔐 Request location permission (Android + iOS)
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        // iOS — trigger location permission popup
        Geolocation.requestAuthorization('whenInUse');
      } else {
        // Android — ask permission via system dialog
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'We need access to your location to show nearby pickup points.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Location permission granted');
        } else {
          console.log('❌ Location permission denied');
        }
      }
    } catch (err) {
      console.warn('Permission Error:', err);
    }
  };

  return (
    <GestureHandlerRootView>
      <ReduxProvider store={store}>
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};

export default App;
