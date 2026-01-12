// Action Types
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const SET_JOB_DETAILS = 'SET_JOB_DETAILS';
export const SET_MESSAGE = 'SET_MESSAGE';
export const SET_BIDS = 'SET_BIDS';

export const setToken = token => ({
  type: SET_TOKEN,
  payload: token,
});
export const setUserDetails = user => ({
  type: SET_USER_PROFILE,
  payload: user,
});

export const setJobDetails = jobDetails => ({
  type: SET_JOB_DETAILS,
  payload: jobDetails,
});

export const setSocketMessage=message=>({
  type: SET_MESSAGE,
  payload: message,
})
export const setBids=bids=>({
  type: SET_BIDS,
  payload: bids,
})
