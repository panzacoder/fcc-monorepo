import { GET_USER_PROFILE, SET_USER_PROFILE } from './userProfileTypes';

const initialState = {
  header: {},
};

const userProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_PROFILE:
      return {
        ...state,
      };
    case SET_USER_PROFILE:
      return {
        ...state,
        header: action.payload,
      };
    default:
      return state;
  }
};

export default userProfileReducer;
