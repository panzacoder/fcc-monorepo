
import {GET_SPONSOR, SET_SPONSOR} from './sponsororTypes';

const getSponsor = () => {
  return {
    type: GET_SPONSOR,
  };
};

const setSponsor = (data) => {
  return {
    type: SET_SPONSOR,
    payload: data,
  };
};

const sponsororAction = {getSponsor, setSponsor};

export default sponsororAction;

