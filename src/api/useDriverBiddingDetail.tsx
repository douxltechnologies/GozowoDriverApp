import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/urls';
import { ErrorObject } from '../model/interface/Error';
import { SaveDriverBiddingDetail } from '../model/class/SaveDriverBiddingDetail';

export const useDriverBiddingDetail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorObject | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const driverBiddingDetails = async (
    token: string,
    data: SaveDriverBiddingDetail,
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      console.log(data);

      const response = await axios.post(
        `${API_BASE_URL}api/MobileUserJob/SaveDriverBiddingDetailAsync`,
        formData,
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
        console.log('Bidding Details saved successfully:', response.data);
        const successMsg =
          response.data?.message || 'Bidding Details saved successfully!';
        setSuccess(successMsg);
        return { success: true, message: successMsg, data: response.data };
      } else {
        const msg =
          response.data?.message || `Server returned status ${response.status}`;

        const errObj: ErrorObject = {
          title: 'Bidding Failed',
          message: msg,
        };

        setError(errObj);
        console.warn('Bidding failed:', msg);
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

  return { driverBiddingDetails, loading, error, success };
};
