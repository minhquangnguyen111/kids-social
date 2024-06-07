import { toast } from "react-toastify";
import { API_BASE_URL, api } from "../../config/api"
import { CREATE_COMMENT_FAILURE, CREATE_COMMENT_REQUEST, CREATE_COMMENT_SUCCESS, CREATE_POST_FAILURE, CREATE_POST_REQUEST, CREATE_POST_SUCCESS, DELETE_POST_FAILURE, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, GET_ALL_POST_FAILURE, GET_ALL_POST_REQUEST, GET_ALL_POST_SUCCESS, GET_USERS_POST_FAILURE, GET_USERS_POST_REQUEST, GET_USERS_POST_SUCCESS, LIKE_COMMENT_FAILURE, LIKE_COMMENT_REQUEST, LIKE_COMMENT_SUCCESS, LIKE_POST_FAILURE, LIKE_POST_REQUEST, LIKE_POST_SUCCESS, SAVE_POST_FAILURE, SAVE_POST_REQUEST, SAVE_POST_SUCCESS } from "./post.actionType"
import { UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS } from "../Auth/auth.actionType";
import axios from "axios";

export const createPostAction = (postData) => async (dispatch) => {
    dispatch({ type: CREATE_POST_REQUEST })
    try {
        const { data } = await api.post(`${API_BASE_URL}/api/posts`, postData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        dispatch({ type: CREATE_POST_SUCCESS, payload: data })
        // console.log("Create post", data)
        toast.success("Post created successfully")
    } catch (error) {
        console.log("Error", error)
        dispatch({ type: CREATE_POST_FAILURE, payload: error })
    }
};

export const getAllPostAction = () => async (dispatch) => {
    dispatch({ type: GET_ALL_POST_REQUEST })
    const token = localStorage.getItem('jwt');
    try {
        const { data } = await api.get(`${API_BASE_URL}/api/posts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        dispatch({ type: GET_ALL_POST_SUCCESS, payload: data })
        // console.log("get all post", data)
    } catch (error) {
        console.log("Error", error)
        dispatch({ type: GET_ALL_POST_FAILURE, payload: error })
    }
};

export const getUsersPostAction = (userId) => async (dispatch) => {
    dispatch({ type: GET_USERS_POST_REQUEST })
    try {
        const { data } = await api.get(`${API_BASE_URL}/api/posts/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        dispatch({ type: GET_USERS_POST_SUCCESS, payload: data })
        // console.log("get users post", data)
    } catch (error) {
        console.log("Error", error)
        dispatch({ type: GET_USERS_POST_FAILURE, payload: error })
    }
};

export const likePostAction = (postId) => async (dispatch) => {
    dispatch({ type: LIKE_POST_REQUEST })
    try {
        const { data } = await api.put(`${API_BASE_URL}/api/posts/like/${postId}`, null, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        dispatch({ type: LIKE_POST_SUCCESS, payload: data })
        // console.log("like post", data)
    } catch (error) {
        console.log("Error", error)
        dispatch({ type: LIKE_POST_FAILURE, payload: error })
    }
};

//CREATE COMMENT
export const createCommentAction = (reqData) => async (dispatch) => {
    dispatch({ type: CREATE_COMMENT_REQUEST })
    const token = localStorage.getItem('jwt');
    try {
        const { data } = await axios.post(`${API_BASE_URL}/api/comments/post/${reqData.postId}`, reqData.data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        dispatch({ type: CREATE_COMMENT_SUCCESS, payload: data })
        // console.log("Create comment", data)
    } catch (error) {
        console.log("Error", error)
        dispatch({ type: CREATE_COMMENT_FAILURE, payload: error })
    }
};

export const savePostAction = (postId) => async (dispatch) => {
    dispatch({ type: SAVE_POST_REQUEST });
    try {
        const { data } = await axios.put(`${API_BASE_URL}/api/posts/save/${postId}`, null, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });
        dispatch({ type: SAVE_POST_SUCCESS, payload: data });

        // console.log("Saved post", data);
    } catch (error) {
        console.log("Error", error);
        dispatch({ type: SAVE_POST_FAILURE, payload: error });
    }
};

export const updateProfileAction = (reqData) => async (dispatch) => {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    try {
        const token = localStorage.getItem('jwt');
        if (!token) {
            // Xử lý trường hợp không có token
            console.error("No token found");
            toast.error("Failed to update profile: No token found");
            dispatch({ type: UPDATE_PROFILE_FAILURE, payload: "No token found" });
            return false;
        }
        const { data } = await axios.patch(`${API_BASE_URL}/api/users`, reqData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // console.log("Update Profile Response:", data);
        toast.success("Profile updated successfully");
        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
        return true; // Trả về true nếu cập nhật thành công
    } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
        dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error });
        return false; // Trả về false nếu cập nhật thất bại
    }
};

export const deletePostAction = (postId) => async (dispatch) => {
    dispatch({ type: DELETE_POST_REQUEST });

    try {
        const jwt = localStorage.getItem('jwt');

        if (!jwt) {
            console.error('JWT token not found in localStorage');
            return;
        }

        const response = await axios.delete(`${API_BASE_URL}/api/posts/${postId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        // console.log(response.data);

        if (response.status === 200) {
            // Dispatch action to update Redux store immediately without reloading
            dispatch({ type: DELETE_POST_SUCCESS, payload: postId });

            // Display a success message (optional)
            toast.success('Post deleted successfully');
        } else {

            console.error('Failed to delete post');
            dispatch({ type: DELETE_POST_FAILURE, payload: 'Failed to delete post' });
        }
    } catch (error) {
        toast.error("You cannot delete other people's posts!")
        console.error('Error deleting post:', error);
        dispatch({ type: DELETE_POST_FAILURE, payload: error });
    }
};


