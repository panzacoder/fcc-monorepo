import { GET_SUBSCRIPTION, SET_SUBSCRIPTION } from './subscriptionTypes';

const initialState = {
    subscription: {},
};

const subscriptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SUBSCRIPTION:
            return {
                ...state,
            };
        case SET_SUBSCRIPTION:
            return {
                ...state,
                subscription: action.payload,
            };
        default:
            return state;
    }
};

export default subscriptionReducer;
