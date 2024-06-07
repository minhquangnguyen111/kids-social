import axios from "axios";
import { API_BASE_URL, api } from "../../config/api"
import * as actionType from "./message.actionType"
//Goc
export const createMessage = (reqData) => async (dispatch) => {
    dispatch({ type: actionType.CREATE_MESSAGE_REQUEST })
    try {
        // console.log("reqData check:", reqData)
        const { data } = await axios.post(`${API_BASE_URL}/api/messages/chat/${reqData.message.chatId}`, reqData.message, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });
        reqData.sendMessageToServer(data)
        console.log("Create message", data);
        dispatch({ type: actionType.CREATE_MESSAGE_SUCCESS, payload: data })
        return data;
    } catch (error) {
        console.log("Catch error", error)
        dispatch({
            type: actionType.CREATE_MESSAGE_FAILURE,
            payload: error,
        });
    }
};


export const createChat = (chat) => async (dispatch) => {
    dispatch({ type: actionType.CREATE_CHAT_REQUEST })
    try {
        const { data } = await axios.post(`${API_BASE_URL}/api/chats`, chat, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });
        console.log("Create chat", data);
        dispatch({ type: actionType.CREATE_CHAT_SUCCESS, payload: data })
    } catch (error) {
        console.log("Catch error", error)
        dispatch({
            type: actionType.CREATE_CHAT_FAILURE,
            payload: error,
        });
    }
};

export const getAllChats = () => async (dispatch) => {
    dispatch({ type: actionType.GET_ALL_CHATS_REQUEST })
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/chats`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });
        console.log("Get all chats", data);
        dispatch({ type: actionType.GET_ALL_CHATS_SUCCESS, payload: data })
    } catch (error) {
        console.log("Catch error", error)
        dispatch({
            type: actionType.GET_ALL_CHATS_FAILURE,
            payload: error,
        });
    }
};