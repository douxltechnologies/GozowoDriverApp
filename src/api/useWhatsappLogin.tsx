import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/urls';

export const useWhatsappLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whatsappLogin = async (phoneNumber: string) => {
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
          // This makes axios resolve even for non-2xx status codes
          validateStatus: () => true,
        },
      );

      console.log('Raw response:', response);

      // If your API includes a "message" field, handle it here
      if (response.status >= 200 && response.status < 300) {
        console.log('Login success:', response.data);
        return response.data;
      } else {
        // handle non-2xx responses gracefully
        const msg =
          response.data?.message || `Server returned status ${response.status}`;
        setError(msg);
        console.warn('Login failed:', msg);
        return null;
      }
    } catch (err: any) {
      console.error('Axios error:', err);
      const msg =
        err?.response?.data?.message || err?.message || 'Something went wrong';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { whatsappLogin, loading, error };
};
