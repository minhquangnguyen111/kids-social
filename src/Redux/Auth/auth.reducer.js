import { LOGIN_GOOGLE_SUCCESS, LOGIN_GOOGLE_FAILURE, CREATE_STORY_FAILURE, CREATE_STORY_REQUEST, CREATE_STORY_SUCCESS, FOLLOW_USER_FAILURE, FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_USERS_FAILURE, GET_USERS_REQUEST, GET_USERS_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, SEARCH_USER_SUCCESS, UNFOLLOW_USER_FAILURE, UNFOLLOW_USER_REQUEST, UNFOLLOW_USER_SUCCESS, UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_USER_AVATAR_SUCCESS, UPDATE_USER_COVER_SUCCESS, LOGIN_GOOGLE_REQUEST, CLEAR_USER_DATA, CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_REQUEST, DELETE_REEL_FAILURE, DELETE_REEL_SUCCESS, DELETE_REEL_REQUEST } from "./auth.actionType";

const initialState = {
    jwt: null,
    error: null,
    loading: false,
    user: null,
    searchUser: []
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        // Các case hiện tại của reducer
        case LOGIN_GOOGLE_REQUEST: // Thêm case cho LOGIN_GOOGLE_REQUEST
        case CREATE_STORY_REQUEST:
        case LOGOUT_REQUEST:
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
        case GET_PROFILE_REQUEST:
        case UPDATE_PROFILE_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_PROFILE_SUCCESS:
            return { ...state, user: action.payload, error: null, loading: false };

        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            return { ...state, jwt: action.payload, loading: false, error: null };

        case SEARCH_USER_SUCCESS:
            return { ...state, searchUser: action.payload, loading: false, error: null };

        case LOGOUT_SUCCESS:
            return { ...state, jwt: null, user: null, loading: false, error: null };

        case LOGIN_FAILURE:
        case REGISTER_FAILURE:
        case LOGOUT_FAILURE:
        case UPDATE_PROFILE_FAILURE:
        case LOGIN_GOOGLE_FAILURE: // Thêm case cho LOGIN_GOOGLE_FAILURE
            return { ...state, loading: false, error: action.payload };

        case UPDATE_PROFILE_SUCCESS:
            return { ...state, user: action.payload, loading: false, error: null };

        case UPDATE_USER_AVATAR_SUCCESS:
            return { ...state, user: { ...state.user, avatar: action.payload.avatar }, loading: false, error: null };
        case UPDATE_USER_COVER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            };
        case GET_USERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FOLLOW_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FOLLOW_USER_SUCCESS:
            // Cập nhật thuộc tính followings của user, không thay thế toàn bộ user
            return {
                ...state,
                loading: false,
                user: {
                    ...state.user,
                    followings: action.payload.followings,
                },
            };
        case FOLLOW_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case GET_USERS_SUCCESS:
            return {
                ...state,
                users: action.payload,
                error: ''
            };
        case GET_USERS_FAILURE:
            return {
                ...state,
                users: [],
                error: action.payload
            };

        case CREATE_STORY_SUCCESS:
            return {
                ...state,
                loading: false,
                story: action.payload
            };
        case CREATE_STORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case CLEAR_USER_DATA:
            return {
                // Trả về trạng thái mặc định của người dùng (đã được khởi tạo ở trên)
            };
        case DELETE_REEL_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case DELETE_REEL_SUCCESS:
            return {
                ...state,
                loading: false,
                reels: state.reels.filter(reel => reel.id !== action.payload)
            };
        case DELETE_REEL_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};
