import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/urls';
import { ErrorObject } from '../model/interface/Error';

export const useGetWallet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorObject | null>(null);

  const getWallet = async (token: string) => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      // Make the API call
      const response = await axios.get(
        `${API_BASE_URL}api/Wallet/GetWalletByIdAsync`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token in request header
          },
          validateStatus: () => true, // Allow handling of all status codes
        },
      );

      // Check if the response is successful (status 2xx)
      if (response.status >= 200 && response.status < 300) {
        return response.data; // Return the fetched data (vehicle categories)
      } else {
        // Handle error response (status codes outside 2xx range)
        const msg =
          response.data?.message || `Server returned status ${response.status}`;
        const errObj: ErrorObject = {
          title: 'Request Failed',
          message: msg,
        };
        setError(errObj);
        console.warn('Request failed:', msg);
        return null; // Return null to indicate failure
      }
    } catch (err: any) {
      // Catch network errors or Axios-specific errors
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
      return null; // Return null to indicate failure
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  return { getWallet, loading, error };
};
