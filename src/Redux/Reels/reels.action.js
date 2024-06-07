import axios from 'axios';
import { GET_ALL_REELS, CREATE_REEL, REELS_ERROR, CREATE_REELS_FAILURE, CREATE_REELS_SUCCESS, CREATE_REELS_REQUEST, GET_USER_REELS, GET_USER_REELS_FAILURE, GET_USER_REELS_SUCCESS, GET_USER_REELS_REQUEST } from './reels.actionType';
import { API_BASE_URL } from '../../config/api';
import { useNavigate } from 'react-router-dom';


export const getAllReelsAction = () => async (dispatch) => {
    try {
        const jwt = localStorage.getItem('jwt'); // Lấy mã JWT từ localStorage
        const response = await axios.get(`${API_BASE_URL}/api/reels`, {
            headers: {
                Authorization: `Bearer ${jwt}` // Thêm mã JWT vào tiêu đề Authorization
            }
        });
        dispatch({
            type: GET_ALL_REELS,
            payload: response.data
        });
        console.log("Check res:", response.data)
    } catch (error) {
        dispatch({
            type: REELS_ERROR,
            payload: error.message
        });
    }
};

export const createReelAction = (reelData) => async (dispatch) => {

    try {
        const jwt = localStorage.getItem('jwt'); // Lấy mã JWT từ localStorage
        const response = await axios.post(`${API_BASE_URL}/api/reels`, reelData, {
            headers: {
                Authorization: `Bearer ${jwt}` // Thêm mã JWT vào tiêu đề Authorization
            }
        });
        dispatch({
            type: CREATE_REEL,
            payload: response.data
        });
        
    } catch (error) {
        dispatch({
            type: REELS_ERROR,
            payload: error.message
        });
    }
};

export const createReelsRequest = () => {
    return {
        type: CREATE_REELS_REQUEST
    };
};

export const createReelsSuccess = (reels) => {
    return {
        type: CREATE_REELS_SUCCESS,
        payload: reels
    };
};

export const createReelsFailure = (error) => {
    return {
        type: CREATE_REELS_FAILURE,
        payload: error
    };
};

export const createReels = (reelsData) => {
    return async (dispatch) => {
        dispatch(createReelsRequest());
        try {
            const jwt = localStorage.getItem('jwt');
            const response = await axios.post(`${API_BASE_URL}/api/reels`, reelsData, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dispatch(createReelsSuccess(response.data));
        } catch (error) {
            dispatch(createReelsFailure(error.message));
        }
    };
};

export const getUserReelsAction = (userId) => {
    return async (dispatch) => {
        dispatch({ type: GET_USER_REELS_REQUEST });

        try {
            const response = await axios.get(`${API_BASE_URL}/api/reels/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            dispatch({
                type: GET_USER_REELS_SUCCESS,
                payload: response.data
            });
            console.log("get user reels", response.data)
        } catch (error) {
            dispatch({
                type: GET_USER_REELS_FAILURE,
                payload: error.message
            });
        }
    };
};