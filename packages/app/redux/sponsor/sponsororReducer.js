import { GET_SPONSOR, SET_SPONSOR } from './sponsororTypes';

const initialState = {
  header: {},
};

const sponsororReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPONSOR:
      return {
        ...state,
      };
    case SET_SPONSOR:
      return {
        ...state,
        header: action.payload,
      };
    default:
      return state;
  }
};

export default sponsororReducer;
