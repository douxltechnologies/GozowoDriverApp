import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { setBids } from '../../../store/actions';
import Bid from '../../components/Bid/Bid';
import { FlatList } from 'react-native';
import { ENDPOINT } from '../../../utils/urls';

const Home = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const BIDS = useSelector((state: any) => state?.bids);
  const TOKEN = useSelector((state: any) => state?.token);
  const PROFILE = useSelector((state: any) => state?.user);

  const socketRef: any = useRef(null);
  const reconnectTimer: any = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!PROFILE?.id || !TOKEN) return;

    const connectWS = () => {
      socketRef.current = new WebSocket(
        `ws://${ENDPOINT}/api/WebSocket/ConnectWebhook/${PROFILE.id}?token=${TOKEN}`,
      );

      socketRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
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

      socketRef.current.onerror = e => {
        console.log('❌ WebSocket error', e.message);
      };

      socketRef.current.onclose = () => {
        console.log('❌ WebSocket closed');
        setIsConnected(false);

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
