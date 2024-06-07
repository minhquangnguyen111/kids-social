import axios from "axios"
import { API_BASE_URL, api } from "../../config/api"
import { CREATE_STORY_FAILURE, CREATE_STORY_REQUEST, CREATE_STORY_SUCCESS, DELETE_REEL_FAILURE, DELETE_REEL_REQUEST, DELETE_REEL_SUCCESS, FOLLOW_USER_FAILURE, FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, GET_PROFILE_FAILURE, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_USERS_FAILURE, GET_USERS_REQUEST, GET_USERS_SUCCESS, LOGIN_FAILURE, LOGIN_GOOGLE_FAILURE, LOGIN_GOOGLE_SUCCESS, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, SEARCH_USER_FAILURE, SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS, UNFOLLOW_USER_FAILURE, UNFOLLOW_USER_REQUEST, UNFOLLOW_USER_SUCCESS, UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS } from "./auth.actionType";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";



export const loginUserAction = (loginData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/signin`, loginData.data);

        if (response.data.token) {
            localStorage.setItem("jwt", response.data.token);
            dispatch({ type: LOGIN_SUCCESS, payload: response.data });
        } else {
            dispatch({ type: LOGIN_FAILURE, payload: "ERROR" });
        }
        // toast.success("Welcome to KIDS SOCIAL!");
    } catch (error) {
        dispatch({ type: LOGIN_FAILURE, payload: error.message });
        toast.error("Invalid email or password");
    }
};



export const registerUserAction = (registerData) => async (dispatch) => {

    dispatch({ type: REGISTER_REQUEST })

    try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, registerData.data);

        if (data.token) {
            localStorage.setItem("jwt", data.token)
            toast.success("Sucessfully registered")
        }
        dispatch({ type: REGISTER_SUCCESS, payload: data }); // Sửa ở đây
    } catch (error) {
        console.log("Err form api-----------", error);
        toast.error(error.response.data.message)
        dispatch({ type: REGISTER_FAILURE, payload: error })
    }
};

export const getProfileAction = (jwt) => async (dispatch) => {
    dispatch({ type: GET_PROFILE_REQUEST })
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`,
            {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                }
            });
        console.log("Profile-----", data)
        dispatch({ type: GET_PROFILE_SUCCESS, payload: data })

    } catch (error) {
        console.log("Err-----------", error)
        dispatch({ type: GET_PROFILE_FAILURE, payload: error })
    }
};

export const updateProfileAction = (reqData) => async (dispatch) => {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    try {
        console.log("Request Data:", reqData); // Kiểm tra dữ liệu gửi đi
        const token = localStorage.getItem('jwt');
        const { data } = await axios.patch(`${API_BASE_URL}/api/users`, reqData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("Update Profile Response:", data); // Kiểm tra response từ server
        toast.success("Profile updated successfully");
        // Cập nhật Redux store với dữ liệu mới từ API
        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
        return true; // Trả về true nếu cập nhật thành công
    } catch (error) {
        console.log("Error:", error);
        toast.error("Failed to update profile");
        dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error });
        return false; // Trả về false nếu cập nhật thất bại
    }
};

export const searchUser = (query) => async (dispatch) => {
    dispatch({ type: SEARCH_USER_REQUEST })
    try {
        const { data } = await api.get(`/api/users/search?query=${query}`);

        console.log("Search user-----", data)
        dispatch({ type: SEARCH_USER_SUCCESS, payload: data })

    } catch (error) {
        console.log("Err-----------", error)
        dispatch({ type: SEARCH_USER_FAILURE, payload: error })
    }
};

export const logoutUserAction = () => async (dispatch) => {
    dispatch({ type: LOGOUT_REQUEST });

    try {
        // Gọi API logout
        const response = await axios.post(`${API_BASE_URL}/auth/logout`, null, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        // Xóa token khỏi localStorage
        localStorage.removeItem("jwt");

        // Dispatch action logout thành công
        dispatch({ type: LOGOUT_SUCCESS });
        toast.success("Logout successful");
    } catch (error) {
        // Dispatch action logout thất bại nếu có lỗi
        dispatch({ type: LOGOUT_FAILURE, payload: error.message || "An error occurred" });
        toast.error("Failed to logout");
    }
};


export const followUser = (userId) => async (dispatch) => {
    dispatch({ type: FOLLOW_USER_REQUEST });

    try {
        // Gọi API để follow hoặc unfollow user với userId cụ thể
        const response = await api.put(`${API_BASE_URL}/api/users/follow/${userId}`, null, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });

        dispatch({ type: FOLLOW_USER_SUCCESS, payload: response.data });
        console.log("Check res.data action follow", response.data);
    } catch (error) {
        dispatch({ type: FOLLOW_USER_FAILURE, payload: error.message });
    }
};


export const getUsers = () => async (dispatch) => {
    dispatch({ type: GET_USERS_REQUEST });
    try {
        const response = await api.get(`${API_BASE_URL}/api/users`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });
        dispatch({
            type: GET_USERS_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: GET_USERS_FAILURE,
            payload: error.response.data.error
        });
    }
};


export const createStory = (storyData) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_STORY_REQUEST });

        try {
            const response = await fetch(`${API_BASE_URL}/api/story`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(storyData)
            });

            const data = await response.json();

            dispatch({ type: CREATE_STORY_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: CREATE_STORY_FAILURE, payload: error.message });
        }
    };
};

export const deleteReel = (reelId) => async (dispatch) => {
    dispatch({ type: DELETE_REEL_REQUEST });
    try {
        await axios.delete(`${API_BASE_URL}/api/reels/${reelId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        dispatch({ type: DELETE_REEL_SUCCESS, payload: reelId });
    } catch (error) {
        dispatch({ type: DELETE_REEL_FAILURE, payload: error.message });
    }
};

