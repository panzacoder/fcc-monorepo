
import { GET_MEMBER_NAMES, SET_MEMBER_NAMES } from './memberNamesTypes';

const getMemberNames = () => {
    return {
        type: GET_MEMBER_NAMES,
    };
};

const setMemberNames = (data:any) => {
    return {
        type: SET_MEMBER_NAMES,
        payload: data,
    };
};

const memberProfileAction = { getMemberNames, setMemberNames };

export default memberProfileAction;

