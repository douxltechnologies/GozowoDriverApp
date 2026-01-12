import { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../utils/urls';
import { ErrorObject } from '../model/interface/Error';
import { useDispatch } from 'react-redux';
import { setSocketMessage } from '../store/actions';

export const useConnectWebhook = () => {
  const dispatch=useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorObject | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  const getWebhookConnection = async (token: string, id: string) => {
    setLoading(true);
    setError(null);

    try {
      // Convert API URL to WebSocket URL
      const wsUrl =
        API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://') +
        `api/WebSocket/ConnectWebhook/${id}?token=${token}`;

      // Create connection
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('✅ WebSocket connected');
        setLoading(false);
      };

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log('📩 Message received from server:', msg);
        dispatch(setSocketMessage(msg));
        // You can handle NEW_JOB, PONG, JOB_UPDATE, LOCATION, etc here
      };

      socket.onerror = (event) => {
        console.error('❌ WebSocket error', event);
        setError({
          title: 'Connection Error',
          message: 'Failed to connect to WebSocket',
        });
      };

      socket.onclose = () => {
        console.log('⚠ WebSocket closed');
      };

      return socket;

    } catch (err: any) {
      console.error('❌ Unexpected error:', err);
      setError({
        title: 'Unexpected Error',
        message: err.message || 'Something went wrong',
      });
      return null;
    }
  };

  return {
    getWebhookConnection,
    socket: socketRef.current,
    loading,
    error,
  };
};
