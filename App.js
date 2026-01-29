import React, { useEffect, useRef } from 'react';
import {
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/components/Stack/AuthStack/AuthStack';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import RNCallKeep from 'react-native-callkeep';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignalRService from './src/service/SignalRService';

const App = () => {
  // ✅ Call UUID ref (persists across renders)
  const callUUIDRef = useRef(null);

  /* =========================
     LOCATION PERMISSION
  ========================= */
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to show nearby pickup points.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        console.log(
          granted === PermissionsAndroid.RESULTS.GRANTED
            ? '✅ Location permission granted'
            : '❌ Location permission denied',
        );
      }
    } catch (err) {
      console.warn('Permission Error:', err);
    }
  };

  /* =========================
     NOTIFICATIONS
  ========================= */
  const displayNotification = async message => {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: message?.notification?.title,
      body: message?.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
    });
  };

  useEffect(() => {
    requestLocationPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 Foreground notification:', remoteMessage);
      displayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  /* =========================
     CALLKEEP SETUP
  ========================= */
  useEffect(() => {
    const options = {
      ios: {
        appName: 'My app name',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This app needs access to your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'OK',
        foregroundService: {
          channelId: 'callkeep-service',
          channelName: 'Call Background Service',
          notificationTitle: 'App is running',
        },
      },
    };

    RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);
  }, []);

  /* =========================
     SIGNALR CALL HANDLING
  ========================= */
  useEffect(() => {
    const handleIncomingCall = async data => {
      if (!data) return;

      console.log('📞 Incoming Call:', data);

      // 🔴 END CALL
      if (data === 'endCall') {
        if (callUUIDRef.current) {
          RNCallKeep.endCall(callUUIDRef.current);
          callUUIDRef.current = null;
        }
        return;
      }

      // 🟢 INCOMING CALL
      if (data === 'calling') {
        // const isActive = await RNCallKeep?.isCallActive();

        // if (!isActive) {
          const uuid = uuidv4(); // 🔑 NEW UUID EVERY CALL
          callUUIDRef.current = uuid;

          await RNCallKeep.displayIncomingCall(
            uuid,
            data?.callerId || '12345',
            data?.callerName || 'Unknown Caller',
            'number',
            false,
          );
        // }
      }
    };

    SignalRService.addCallListener(handleIncomingCall);
    return () => {
      SignalRService.removeCallListener(handleIncomingCall);
    };
  }, []);

  useEffect(() => {
  const onAnswerCall = async ({ callUUID }) => {
    const data =await AsyncStorage.getItem('CUSTOMER_ID');
    if(data!=undefined){
      RNCallKeep.setCurrentCallActive(callUUIDRef.current,'user','user');
      await SignalRService.sendCallStatus(data,'acceptCall','acceptCall');
      console.log('THIS IS DRIVER ID::::::::::::::::::::::::::::::::::::::::::::::',data);
    }
  };

  RNCallKeep.addEventListener('answerCall', onAnswerCall);

  return () => {
    RNCallKeep.removeEventListener('answerCall', onAnswerCall);
  };
}, []);

  useEffect(() => {
  const onEndCall = async ({ callUUID }) => {
    const data =await AsyncStorage.getItem('CUSTOMER_ID');
    if(data!=undefined){
      await SignalRService.sendCallStatus(data,'rejectCall','rejectCall');
      console.log('THIS IS DRIVER ID::::::::::::::::::::::::::::::::::::::::::::::',data);
    }
  };

  RNCallKeep.addEventListener('endCall', onEndCall);

  return () => {
    RNCallKeep.removeEventListener('endCall', onEndCall);
  };
}, []);

  /* =========================
     APP UI
  ========================= */
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
