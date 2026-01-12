import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/urls';
import { ErrorObject } from '../model/interface/Error';

export const useVerifyOTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorObject | null>(null);

  const verifyOTP = async (
    code: string,
    otp: number,
    deviceId: string,
    rememberMe: boolean,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/Login/verify-otp`,
        {
          code,
          otp,
          deviceId,
          rememberMe,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: () => true,
        },
      );

      console.log('Raw response:', response);

      if (response.status >= 200 && response.status < 300) {
        console.log('OTP verified successfully:', response.data);
        return response.data;
      } else {
        const msg =
          response.data?.message || `Server returned status ${response.status}`;

        const errObj: ErrorObject = {
          title: 'Verification Failed',
          message: msg,
        };

        setError(errObj);
        console.warn('OTP verification failed:', msg);
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

  return { verifyOTP, loading, error };
};
