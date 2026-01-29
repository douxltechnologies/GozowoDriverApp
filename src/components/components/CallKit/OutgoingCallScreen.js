import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import RNCallKeep from 'react-native-callkeep';
import SignalRService from '../../../service/SignalRService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

const OutgoingCallScreen = ({ route, navigation }) => {
  const callUUIDRef = useRef(uuidv4()); // stable UUID
  const callUUID = callUUIDRef.current;
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const { driverId } = route?.params;
  const [callConnected, setCallConnected] = useState(false);
useEffect(() => {
  const handleIncomingCall = data => {
    console.log('Passenger::::', data);

    if (data === 'acceptCall') {
      console.log('Call accepted!');
      // RNCallKeep.(callUUID,'user','user');
      RNCallKeep.setCurrentCallActive(callUUID,'user','user');
      setCallConnected(true);
    } else if (data === 'endCall' || data === 'rejectCall') {
      RNCallKeep.endCall(callUUID);
      setCallConnected(false);
      navigation.goBack();
    }
  };

  SignalRService.addCallListener(handleIncomingCall);

  return () => {
    SignalRService.removeCallListener(handleIncomingCall);
  };
}, []);

useEffect(() => {
  console.log("callConnected updated:", callConnected);
}, [callConnected]);

  console.log(
    ':::::::::::::::::::::::::::::::::::::::::::::::::::::::::Passenger::::::',
    callConnected,
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Contact Header */}
      <View style={styles.header}>
        <Icon name="lock-closed" size={14} color="#8e8e93" />
        <Text style={styles.encryptedText}>End-to-end encrypted</Text>
      </View>

      {/* Main Contact Info */}
      <View style={styles.contactContainer}>
        <Text style={styles.name}>Alex Rivera</Text>
        <Text style={styles.status}>
          {callConnected == false ? 'calling...' : '00:00'}
        </Text>
        <Image
          source={{ uri: 'https://i.pravatar.cc/300' }}
          style={styles.avatar}
        />
      </View>

      {/* Controls Section */}
      <View style={styles.controlsWrapper}>
        <View style={styles.row}>
          <CallAction
            name={isMuted ? 'mic-off' : 'mic'}
            label="mute"
            onPress={() => setIsMuted(!isMuted)}
            active={isMuted}
          />
          <CallAction name="grid" label="keypad" />
          <CallAction
            name="volume-high"
            label="speaker"
            onPress={() => setIsSpeaker(!isSpeaker)}
            active={isSpeaker}
          />
        </View>

        <View style={styles.row}>
          <CallAction name="add" label="add call" />
          <CallAction name="videocam" label="video" />
          <CallAction name="person" label="contacts" />
        </View>

        {/* End Call Button */}
        <View style={styles.endCallRow}>
          <TouchableOpacity
            onPress={() => {
              // setIsCalling(false);
              SignalRService.sendCallStatus(driverId, 'endCall', 'endCall');
              navigation.goBack();
              setCallConnected(false);
            }}
            style={styles.endCallButton}
            activeOpacity={0.8}
          >
            <Icon
              name="call"
              color="white"
              size={38}
              style={styles.hangupIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const CallAction = ({ name, label, onPress, active }) => (
  <View style={styles.actionItem}>
    <TouchableOpacity
      onPress={onPress}
      style={[styles.iconCircle, active && styles.activeCircle]}
    >
      <Icon name={name} color={active ? 'black' : 'white'} size={30} />
    </TouchableOpacity>
    <Text style={styles.actionLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c1c1e' },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  encryptedText: { color: '#8e8e93', fontSize: 12, marginLeft: 5 },
  contactContainer: { alignItems: 'center', marginTop: 50 },
  name: { color: 'white', fontSize: 36, fontWeight: '300' },
  status: { color: '#0a84ff', fontSize: 18, marginTop: 8, fontWeight: '500' },
  avatar: { width: 140, height: 140, borderRadius: 70, marginTop: 40 },

  controlsWrapper: { paddingHorizontal: 30, marginBottom: 40 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionItem: { alignItems: 'center', width: 80 },
  iconCircle: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#3a3a3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeCircle: { backgroundColor: 'white' },
  actionLabel: { color: 'white', fontSize: 13, fontWeight: '400' },

  endCallRow: { alignItems: 'center', marginTop: 20 },
  endCallButton: {
    backgroundColor: '#ff3b30',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hangupIcon: { transform: [{ rotate: '135deg' }] },
});

export default OutgoingCallScreen;
