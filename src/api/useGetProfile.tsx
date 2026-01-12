import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/urls';
import { ErrorObject } from '../model/interface/Error';

export const useGetProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorObject | null>(null);

  const getProfileDetails = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      // Make the API call
      const response = await axios.get(
        `${API_BASE_URL}api/MobileUser/GetUserProfileByIdAsync`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          validateStatus: () => true,
        },
      );

      // Check if the response is successful (status 2xx)
      if (response.status >= 200 && response.status < 300) {
        return response.data; // Return fetched data
      } else {
        // Handle non-2xx responses
        const msg =
          response.data?.message || `Server returned status ${response.status}`;
        const errObj: ErrorObject = {
          title: 'Request Failed',
          message: msg,
        };
        setError(errObj);
        console.warn('Request failed:', msg);
        return null;
      }
    } catch (err: any) {
      // Handle network or Axios errors
      console.error('Axios error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong with the network or server';
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

  return { getProfileDetails, loading, error };
};
