import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { setBids } from '../../../store/actions';
import Bid from '../../components/Bid/Bid';
import { FlatList, PermissionsAndroid, Platform } from 'react-native';
import { ENDPOINT } from '../../../utils/urls';
import Geolocation from '@react-native-community/geolocation';

const Home = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const BIDS = useSelector((state: any) => state?.bids);
  const TOKEN = useSelector((state: any) => state?.token);
  const PROFILE = useSelector((state: any) => state?.user);

  const socketRef: any = useRef(null);
  const reconnectTimer: any = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  let wsWatchId: any = null;

  useEffect(() => {
    if (!PROFILE?.id || !TOKEN) return;

    const connectWS = () => {
      socketRef.current = new WebSocket(
        `ws://${ENDPOINT}/api/WebSocket/ConnectWebhook/${PROFILE.id}?token=${TOKEN}`,
      );

      socketRef.current.onopen = () => {
      wsWatchId = Geolocation.watchPosition(
          position => {
            console.log('This is position:::::::::::::::::::::::',position);
         if (socketRef.current?.readyState === WebSocket.OPEN) {
              socketRef.current.send(
                JSON.stringify({
                  type: 'DRIVER_LOCATION',
                  name:PROFILE?.name,
                  image:PROFILE?.imageUrl,
                  rating:PROFILE?.rating,
                  // latitude: position.coords.latitude,
                  // longitude: position.coords.longitude,
                  // speed: position.coords.speed,
                  latitude : 25.1935406,
                  longitude : 55.2800032,
                  speed : 10,
                }),
              );
            }
          },
          error => console.log('Location error:', error),
          {
            enableHighAccuracy: true,
            distanceFilter: 10,
            interval: 15000,
            fastestInterval: 10000,
          },
        );
      };
     
      socketRef.current.onmessage = (event: any) => {
        try {
          const msg = JSON.parse(event.data);
          console.log('📩 Message:', msg?.type);
          dispatch(setBids(msg));
        } catch (e) {
          console.log('❌ JSON parse error', e);
        }
      };

      socketRef.current.onerror = (e:any) => {
        console.log('❌ WebSocket error', e.message);
      };

      socketRef.current.onclose = () => {
        console.log('❌ WebSocket closed');
        reconnectTimer.current = setTimeout(connectWS, 3000);
      };
    };

    connectWS();

    return () => {
      console.log('🧹 Closing WebSocket');
      clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
    };
  }, [PROFILE?.id, TOKEN, isFocused]);

  const formatTime = (seconds: any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  // let socket: any = null;
  // socketRef.current = socket;
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // useEffect(() => {
  //   const connectWebSocket = async () => {
  //     const granted = await requestPermission();
  //     if (!granted) return;
  //     socketRef.current = new WebSocket(
  //       `ws://${ENDPOINT}/api/WebSocket/ConnectWebhook/${PROFILE.id}?token=${TOKEN}`,
  //     );
  //     socketRef.current.onopen = () => {
        // wsWatchId = Geolocation.watchPosition(
        //   position => {
  //           if (socketRef.current?.readyState === WebSocket.OPEN) {
  //             socketRef.current.send(
  //               JSON.stringify({
  //                 type: 'DRIVER_LOCATION',
  //                 name:PROFILE?.name,
  //                 image:PROFILE?.imageUrl,
  //                 rating:PROFILE?.rating,
  //                 // latitude: position.coords.latitude,
  //                 // longitude: position.coords.longitude,
  //                 // speed: position.coords.speed,
  //                 latitude : 25.1935406,
  //                 longitude : 55.2800032,
  //                 speed : 10,
  //               }),
  //             );
      //       }
      //   //   },
      //   //   error => console.log('Location error:', error),
      //   //   {
      //   //     enableHighAccuracy: true,
      //   //     distanceFilter: 10,
      //   //     interval: 15000,
      //   //     fastestInterval: 10000,
      //   //   },
      //   // );
      // };

  //     socketRef.current.onclose = () => console.log('WebSocket closed');
  //     socketRef.current.onerror = (e: any) => console.log('WebSocket error', e);
  //   };

  //   connectWebSocket();

  //   return () => {
  //     if (wsWatchId !== null) Geolocation.clearWatch(wsWatchId);
  //     if (socketRef.current) {
  //       socketRef.current.close();
  //       socketRef.current = null;
  //     }
  //   };
  // }, []);
const tempBidRef = useRef<any>(null);
const [finalBids, setFinalBids] = useState<any[]>([]);

// Handle incoming bid ONE BY ONE
const onBidReceived = (newBid: any) => {
  if (!newBid) return;

  // First bid
  if (!tempBidRef.current) {
    tempBidRef.current = newBid;
    setFinalBids([newBid]);
    return;
  }

  // Match by jobId
  if (newBid?.data?.jobId === tempBidRef.current?.data?.jobId) {
    tempBidRef.current = newBid;

    setFinalBids(prev =>
      prev.map((bid, index) =>
        index === prev.length - 1 ? newBid : bid
      ),
    );
  } else {
    tempBidRef.current = newBid;
    setFinalBids(prev => [...prev, newBid]);
  }
};

// Whenever redux BIDS updates
useEffect(() => {
  if (BIDS) {
    onBidReceived(BIDS);
    console.log(BIDS);
  }
}, [BIDS]);


  return (
    <FlatList
      data={BIDS || []}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Bid navigation={navigation} formatTime={formatTime} item={item} />
      )}
    />
  );
};

export default Home;
