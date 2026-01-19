import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/components/Stack/AuthStack/AuthStack';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const App = () => {
  useEffect(() => {
    requestLocationPermission();
    const unsubscribe = foregroundNotificationListener();
    return () => unsubscribe();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse');
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your location to show nearby pickup points.',
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

  // 🔔 Foreground notification listener
  const foregroundNotificationListener = () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 Foreground notification received:', remoteMessage);
      onDisplayNotification(remoteMessage);
    });

    return unsubscribe;
  };

  async function onDisplayNotification(message:any) {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: message?.messageId,
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: message?.notification?.title,
      body: message?.notification?.body,
      android: {
        channelId,
        
        showTimestamp:true,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};

export default App;
