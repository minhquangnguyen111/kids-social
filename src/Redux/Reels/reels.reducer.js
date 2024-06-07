import { GET_ALL_REELS, CREATE_REEL, REELS_ERROR, CREATE_REELS_FAILURE, CREATE_REELS_SUCCESS, CREATE_REELS_REQUEST, GET_USER_REELS, GET_USER_REELS_FAILURE, GET_USER_REELS_SUCCESS, GET_USER_REELS_REQUEST } from './reels.actionType';

const initialState = {
    reels: [],
    loading: false,
    error: null
};

export const reelsReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_REELS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case CREATE_REELS_SUCCESS:
            return {
                ...state,
                reels: [...state.reels, action.payload],
                loading: false,
                error: null
            };
        case CREATE_REELS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case GET_ALL_REELS:
            return {
                ...state,
                reels: action.payload,
                error: null
            };
        case GET_USER_REELS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_USER_REELS_SUCCESS:
            return {
                ...state,
                userReels: action.payload,
                loading: false
            };
        case GET_USER_REELS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case REELS_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};