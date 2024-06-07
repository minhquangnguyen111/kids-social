
import axios from "axios";
import { API_BASE_URL, api } from "../../config/api";
import { GET_ALL_COMMENT_FAILURE, GET_ALL_COMMENT_REQUEST, GET_ALL_COMMENT_SUCCESS, GET_USER_BY_ID_FAILURE, GET_USER_BY_ID_REQUEST, GET_USER_BY_ID_SUCCESS, LIKE_COMMENT_FAILURE, LIKE_COMMENT_REQUEST, LIKE_COMMENT_SUCCESS } from "./comment.actionType";

export const likeCommentAction = (commentId) => async (dispatch) => {
   dispatch({ type: LIKE_COMMENT_REQUEST });
   const jwt = localStorage.getItem("jwt");
   try {
      const { data } = await axios.put(`${API_BASE_URL}/api/comments/like/${commentId}`, null, {
         headers: {
            'Authorization': `Bearer ${jwt}`,
         }
      });
      dispatch({ type: LIKE_COMMENT_SUCCESS, payload: data });
      console.log("Liked comment", data);
   } catch (error) {
      console.log("Error", error);
      dispatch({ type: LIKE_COMMENT_FAILURE, payload: error });
   }
};



export const getAllCommentsAction = () => async (dispatch) => {
   dispatch({ type: GET_ALL_COMMENT_REQUEST });
   const token = localStorage.getItem("jwt");
   try {
      const { data } = await axios.get(`${API_BASE_URL}/api/comments`, {
         headers: {
            'Authorization': `Bearer ${token}`
         }
      });
      dispatch({ type: GET_ALL_COMMENT_SUCCESS, payload: data })
      // console.log("get all comments", data)
   } catch (error) {
      console.log("Error", error)
      dispatch({ type: GET_ALL_COMMENT_FAILURE, payload: error })
   }
};

export const getUserByIdAction = (userId) => {
   return async (dispatch) => {
      dispatch({ type: GET_USER_BY_ID_REQUEST });
      try {
         const jwt = localStorage.getItem('jwt');
         const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
            headers: {
               Authorization: `Bearer ${jwt}`
            }
         });
         dispatch({ type: GET_USER_BY_ID_SUCCESS, payload: response.data });
      } catch (error) {
         dispatch({ type: GET_USER_BY_ID_FAILURE, payload: error.message });
      }
   };
};