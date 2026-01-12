import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/urls';
import { ErrorObject } from '../model/interface/Error';

export const useVerifyEmailOTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorObject | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const verifyEmailOTP = async (token: string, otp: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // ✅ email ko query params mein add kiya gaya hai
      const response = await axios.post(
        `${API_BASE_URL}api/MobileUser/VerifyEmailOtpAsync/` + otp,
        { otp: otp },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          validateStatus: () => true,
        },
      );

      console.log('Raw response:', response);

      if (response.status >= 200 && response.status < 300) {
        console.log('Email Verification Completed!', response.data);
        const successMsg =
          response.data?.message || 'Email Verification Completed!';
        setSuccess(successMsg);
        return { success: true, message: successMsg, data: response.data };
      } else {
        const msg =
          response.data?.message || `Server returned status ${response.status}`;

        const errObj: ErrorObject = {
          title: 'Unable to verify email',
          message: msg,
        };

        setError(errObj);
        console.warn('Unable to verify email', msg);
        return { success: false, message: msg };
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
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return { verifyEmailOTP, loading, error, success };
};
