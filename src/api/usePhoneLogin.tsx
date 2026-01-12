import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/urls';
import { ErrorObject } from '../model/interface/Error';

export const usePhoneLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorObject | null>(null);

  const phoneLogin = async (phoneNumber: string) => {
    console.log('Test', phoneNumber);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/Login/login`,
        { phoneNumber },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: () => true,
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log('Login success:', response.data);
        return response.data;
      } else {
        const msg =
          response.data?.message || `Server returned status ${response.status}`;
        const errObj: ErrorObject = {
          title: 'Login Failed',
          message: msg,
        };
        setError(errObj);
        console.warn('Login failed:', msg);
        return null;
      }
    } catch (err: any) {
      console.error('Axios error:', err);
      const msg =
        err?.response?.data?.message || err?.message || 'Something went wrong';
      const errObj: ErrorObject = {
        title: 'Network Error',
        message: msg,
      };
      setError(errObj);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { phoneLogin, loading, error };
};
