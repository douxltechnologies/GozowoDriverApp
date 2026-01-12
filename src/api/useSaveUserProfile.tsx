import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/urls';
import { ErrorObject } from '../model/interface/Error';
import { SaveUserProfileRequest } from '../model/class/SaveUserProfileRequest';

export const useSaveUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorObject | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const saveUserProfile = async (
    token: string,
    data: SaveUserProfileRequest,
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();

      if (data.profileImage) formData.append('ProfileImage', data.profileImage);
      formData.append('data', JSON.stringify(data));
      console.log(data);

      const response = await axios.post(
        `${API_BASE_URL}api/MobileUser/SaveUserAsync`,
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
        console.log('Profile saved successfully:', response.data);
        const successMsg =
          response.data?.message || 'Profile saved successfully!';
        setSuccess(successMsg);
        return { success: true, message: successMsg, data: response.data };
      } else {
        const msg =
          response.data?.message || `Server returned status ${response.status}`;

        const errObj: ErrorObject = {
          title: 'Save Failed',
          message: msg,
        };

        setError(errObj);
        console.warn('Save profile failed:', msg);
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

  return { saveUserProfile, loading, error, success };
};
