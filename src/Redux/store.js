import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/auth.reducer";
import { postReducer } from "./Post/post.reducer";
import { messageReducer } from "./Message/message.reducer";
import { reelsReducer } from "./Reels/reels.reducer";
import commentReducer from "./Comment/comment.reducer";

const rootReducers = combineReducers({

    auth: authReducer,
    post: postReducer,
    message: messageReducer,
    reels: reelsReducer,
    comment: commentReducer
})

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));