import {
   GET_ALL_COMMENT_FAILURE,
   GET_ALL_COMMENT_REQUEST,
   GET_ALL_COMMENT_SUCCESS,
   LIKE_COMMENT_FAILURE,
   LIKE_COMMENT_REQUEST,
   LIKE_COMMENT_SUCCESS,
   GET_USER_BY_ID_REQUEST,
   GET_USER_BY_ID_SUCCESS,
   GET_USER_BY_ID_FAILURE,
} from './comment.actionType';

const initialState = {
   loading: false,
   comment: {},
   error: null,
   likedComments: [],
   comments: []
};

const commentReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_ALL_COMMENT_REQUEST:
         return { ...state, error: null, loading: true };
      case GET_ALL_COMMENT_SUCCESS:
         return { ...state, comments: action.payload };
      case GET_ALL_COMMENT_FAILURE:
         return { ...state, error: action.payload, loading: false };
      case LIKE_COMMENT_REQUEST:
         return { ...state, loading: true };
      case LIKE_COMMENT_SUCCESS:
         return {
            ...state,
            comments: state.comments.map(comment =>
               comment.id === action.payload.id ? action.payload : comment
            ),
            loading: false,
            error: null
         };
      case LIKE_COMMENT_FAILURE:
         return { ...state, loading: false, error: action.payload };
      case GET_USER_BY_ID_REQUEST:
         return { ...state, loading: true, error: null };
      case GET_USER_BY_ID_SUCCESS:
         return { ...state, loading: false, userById: action.payload, error: null };
      case GET_USER_BY_ID_FAILURE:
         return { ...state, loading: false, error: action.payload };
      default:
         return state;
   }
};

export default commentReducer;
