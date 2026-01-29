// Action Types
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const SET_JOB_DETAILS = 'SET_JOB_DETAILS';
export const SET_MESSAGE = 'SET_MESSAGE';
export const SET_BIDS = 'SET_BIDS';
export const SET_STATUS = 'SET_STATUS';
export const SET_CONNECTED_CALL = 'SET_CONNECTED_CALL';

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
export const setCallStatus=callStatus=>({
  type: SET_STATUS,
  payload: callStatus,
})
export const setConnectedCall=callConnected=>({
  type: SET_CONNECTED_CALL,
  payload: callConnected,
})
