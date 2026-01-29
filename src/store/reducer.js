import {
  SET_BIDS,
  SET_JOB_DETAILS,
  SET_MESSAGE,
  SET_TOKEN,
  SET_USER_PROFILE,
  SET_CONNECTED_CALL,
  SET_STATUS,
} from './actions';

const initialState = {
  token: null,
  user: {},
  jobDetails: {},
  message: {},
  bids: [],
  status: null,
  call_connected: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, token: action.payload }; // ✅ Fixed line
    case SET_USER_PROFILE:
      return { ...state, user: action.payload }; // ✅ Fixed line
    case SET_JOB_DETAILS:
      return { ...state, jobDetails: action.payload }; // ✅ Fixed line
    case SET_MESSAGE:
      return { ...state, message: action.payload }; // ✅ Fixed line
    case SET_BIDS:
      return { ...state, bids: action.payload }; // ✅ Fixed line
    case SET_STATUS:
      return { ...state, status: action.payload }; // ✅ Fixed line
    case SET_CONNECTED_CALL:
      return { ...state, call_connected: action.payload }; // ✅ Fixed line
    default:
      return state;
  }
};

export default reducer;
