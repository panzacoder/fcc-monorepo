
import {GET_USER_PROFILE, SET_USER_PROFILE} from './userProfileTypes';

const getUserProfile = () => {
  return {
    type: GET_USER_PROFILE,
  };
};

const setUserProfile = (data) => {
  return {
    type: SET_USER_PROFILE,
    payload: data,
  };
};

const userProfileAction = {getUserProfile, setUserProfile};

export default userProfileAction;

