import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Avatar, Card, CardActions, CardContent, CardHeader, Divider, IconButton, Menu, MenuItem, Typography, Dialog, DialogTitle, DialogActions, Button, Snackbar, Alert, DialogContent, TextareaAutosize, DialogContentText, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { useDispatch, useSelector } from 'react-redux';
import { createCommentAction, likePostAction, savePostAction, deletePostAction, getAllPostAction } from '../../Redux/Post/post.action.js';
import { isLikedByRegUser } from '../../Utils/isLikedByReqUser';
import { getAllCommentsAction, likeCommentAction } from '../../Redux/Comment/comment.action.js';
import { isSavedByRegUser } from '../../Utils/isSavedByReqUser.js';
import "../../config/overflow.css";
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import { isCommentLikedByRegUser } from './../../Utils/isLikedCommentByReqUser';
import { formatCreatedAt } from './formatCreateAt.js';
import { Link } from 'react-router-dom';
import './emoji.css'
import { memo } from 'react';
import sensitiveWords from '../../Utils/sensitiveWords.js';
import { toast } from 'react-toastify';


const PostCard = memo(({ item, userPosts }) => {
    const [showComments, setShowComments] = useState(false);
    const [numLikes, setNumLikes] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const { auth, comment } = useSelector(store => store);
    const dispatch = useDispatch();
    const [isSaved, setIsSaved] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showFullCaption, setShowFullCaption] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [showDeleteError, setShowDeleteError] = useState(false);
    const [showSaveError, setShowSaveError] = useState(false);
    const [showFullComment, setShowFullComment] = useState(false);
    const [commentRows, setCommentRows] = useState(1);
    const insertEmoticonRef = useRef(null);
    const { post } = useSelector((store) => store);
    const [comments, setComments] = useState([]);
    const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: 0, left: 0 });
    const [likedComments, setLikedComments] = useState([]);
    const [commentLikes, setCommentLikes] = useState({});
    const [likedUsers, setLikedUsers] = useState([]);
    const [openLikedUsersDialog, setOpenLikedUsersDialog] = useState(false);
    const [isSensitive, setIsSensitive] = useState(false);

    useEffect(() => {
        // Hàm kiểm tra từ ngữ nhạy cảm
        const checkSensitiveWords = (caption) => {

            // Kiểm tra từng từ trong caption
            for (let word of sensitiveWords) {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                if (regex.test(caption)) {
                    setIsSensitive(true);
                    return; // Nếu tìm thấy từ ngữ nhạy cảm, dừng kiểm tra và đặt isSensitive thành true
                }
            }
            setIsSensitive(false); // Nếu không tìm thấy từ ngữ nhạy cảm, đặt isSensitive thành false
        };

        // Kiểm tra từ ngữ nhạy cảm trong caption của item
        checkSensitiveWords(item.caption);
    }, [item.caption]);

    useEffect(() => {
        if (comment.comments.length > 0) {
            const likedUsers = comment.comments.filter(c => c.id === item.id && c.commentLiked).map(c => c.commentLiked);
            setLikedUsers(likedUsers.flat());
        }
    }, [comment.comments, item.id]);

    useEffect(() => {
        // Lấy danh sách các comment đã được người dùng hiện tại like
        const likedCommentIds = comment.comments.filter((c) =>
            isCommentLikedByRegUser(auth.user?.id, c)
        ).map((c) => c.id);
        setLikedComments(likedCommentIds);
    }, [comment.comments, auth.user?.id]);

    const handleOpenLikedUsersDialog = () => {
        setOpenLikedUsersDialog(true);
    };

    const handleCloseLikedUsersDialog = () => {
        setOpenLikedUsersDialog(false);
    };

    useEffect(() => {
        // Tính toán số lượng lượt thích của từng bình luận
        const commentLikesCount = {};
        comment.comments.forEach((c) => {
            commentLikesCount[c.id] = c.commentLiked ? c.commentLiked.length : 0;
        });
        setCommentLikes(commentLikesCount);
    }, [comment.comments]);


    useEffect(() => {
        // Cập nhật trạng thái cục bộ comments từ props item
        const updatedComments = item.comments?.map(comment => ({
            ...comment,
        }));
        setComments(updatedComments);
    }, [item?.comments, auth.user?.id]);

    useEffect(() => {
        setNumLikes(item.liked?.length);
        setIsSaved(isSavedByRegUser(auth.user?.id, item));
    }, [item, auth.user?.id]);

    useEffect(() => {
        dispatch(getAllPostAction());
    }, [post.newComment]);

    useEffect(() => {
        dispatch(getAllCommentsAction());
    }, []);

    const handleShowComment = () => setShowComments(!showComments);

    const handleCreateComment = useCallback((content) => {
        if (content.trim() === '') {
            return;
        }

        // Kiểm tra từ nhạy cảm
        const checkSensitiveWords = (text) => {
            for (let word of sensitiveWords) {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                if (regex.test(text)) {
                    return true; // Nếu tìm thấy từ nhạy cảm, trả về true
                }
            }
            return false; // Nếu không tìm thấy từ nhạy cảm, trả về false
        };

        if (checkSensitiveWords(content)) {
            toast.warning("Bình luận chứa nội dung không phù hợp !") // Hiển thị thông báo lỗi
            return; // Dừng thực hiện nếu có từ nhạy cảm
        }

        const newComment = {
            id: Date.now(), // Tạm thời gán id để React có thể render đúng
            content,
            user: auth.user,
            createAt: new Date().toISOString(),
            commentLiked: []
        };

        setComments([...comments, newComment]); // Hiển thị bình luận ngay lập tức

        const reqData = {
            postId: item?.id,
            data: { content }
        };

        dispatch(createCommentAction(reqData)).then(() => {
            dispatch(getAllCommentsAction()); // Cập nhật lại danh sách bình luận từ server

            // Khởi tạo like của bình luận vừa tạo bằng 0
            const updatedComments = [...comments, { ...newComment, commentLiked: [] }];
            setComments(updatedComments);
        });

        setCommentContent('');
        setCommentRows(1);
    }, [auth.user, comments, dispatch, item?.id]);

    const handleLikePost = () => {
        dispatch(likePostAction(item?.id));
    };
    // console.log("Check item", item)

    const handleLikeComment = useCallback((commentId) => {
        dispatch(likeCommentAction(commentId));
    }, [dispatch]);
    const isCommentLiked = useCallback((commentId) => likedComments.includes(commentId), [likedComments]);










    const handleSavePost = () => {
        try {
            dispatch(savePostAction(item?.id));
            setShowSaveConfirmation(false);
        } catch (error) {
            setShowSaveError(true);
        }
    };

    const handleDeletePost = async () => {
        try {
            dispatch(deletePostAction(item?.id));
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error('Error deleting post:', error);
            setShowDeleteError(true);
        }
    };



    const formattedCreatedAt = formatCreatedAt(item.createAt);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleEmojiClick = (emoji) => {
        const emojiString = emoji.emoji;
        setCommentContent((prevContent) => prevContent + emojiString);
    };

    const handleEmojiIconClick = (e) => {
        e.stopPropagation();
        const postElement = e.currentTarget.closest('.w-full'); // Điều chỉnh lớp CSS tùy vào cấu trúc HTML của bạn
        const postRect = postElement.getBoundingClientRect();
        const postTop = postRect.top + window.pageYOffset;
        setEmojiPickerPosition({
            top: postTop - 300, // Điều chỉnh tùy theo chiều cao của emoji picker
            left: postRect.left, // Có thể điều chỉnh tùy theo vị trí bạn muốn
        });
        toggleEmojiPicker();
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const toggleShowFullCaption = () => {
        setShowFullCaption(!showFullCaption);
    };

    const toggleDeleteConfirmation = () => {
        setShowDeleteConfirmation(!showDeleteConfirmation);
    };

    const toggleSaveConfirmation = () => {
        setShowSaveConfirmation(!showSaveConfirmation);
    };

    const handleCloseDeleteError = () => {
        setShowDeleteError(false);
    };

    const handleCloseSaveError = () => {
        setShowSaveError(false);
    };

    const handleTextareaChange = (e) => {
        const lineHeight = 18;
        const previousRows = e.target.rows;
        e.target.rows = 1;
        const currentRows = Math.floor(e.target.scrollHeight / lineHeight);
        if (currentRows === previousRows) {
            e.target.rows = currentRows;
        }
        setCommentRows(currentRows < 50 ? currentRows : 50);
    };

    const toggleCommentExpansion = () => {
        setShowFullComment(!showFullComment);
    };

    return (
        <Card className='w-full'>
            <CardHeader
                avatar={
                    <Link to={`/profile/${item?.user?.id}`}>
                        <Tooltip title={
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
                                <Avatar style={{ marginRight: '10px', width: '50px', height: '50px' }} src={item.user?.avatar} />

                                <div>
                                    <p>{item.user?.firstName + " " + item.user?.lastName}</p>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <p>{item.user?.followers?.length} followers</p>
                                        <p style={{ margin: '0 10px' }}>•</p>
                                        <p>{item.user?.followings?.length} followings</p>
                                    </div>
                                    {/* Thêm các thông tin khác bạn muốn hiển thị */}
                                </div>
                            </div>
                        }>
                            <Avatar
                                sx={{
                                    bgcolor: '#191c29',
                                    color: 'rgb(88,199,250)',
                                    fontSize: '.8rem'
                                }}
                                aria-label="recipe"
                                src={item.user?.avatar}
                            />
                        </Tooltip>

                    </Link>
                }

                action={
                    <div>
                        <IconButton className="hover:text-blue-400" aria-label="settings" onClick={handleClickMenu}>
                            <MoreVertIcon style={{color: 'blue'}} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                        >
                            <MenuItem style={{ color: '#FF6A6A' }} onClick={toggleDeleteConfirmation}>
                                <DeleteIcon />
                                <Typography variant="inherit">  Xóa bài đăng </Typography>
                            </MenuItem>
                        </Menu>
                    </div>
                }
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

                        <Link to={`/profile/${item?.user?.id}`}>
                            <Typography variant="subtitle1" component="div" className='hover:underline'>
                                {item.user?.firstName + " " + item.user?.lastName}
                            </Typography>
                        </Link>
                        <Typography variant="body2" color="textSecondary">
                            {formattedCreatedAt}
                        </Typography>
                    </div>
                }
                subheader={item.user?.email.split("@")[0]}
            />
            <CardContent>
                <Typography variant="body2" color="" className="max-w-4xl break-words whitespace-pre-line">
                    {isSensitive ? (
                        <Typography variant="body2" color="error">
                            This content is inappropriate.
                        </Typography>
                    ) : (
                        <p className='text-lg '>
                            {showFullCaption ? item.caption : (item.caption?.length > 100 ? item.caption.slice(0, 100) + '...' : item.caption)}
                            {item.caption?.length > 100 && !showFullCaption && (
                                <button className="text-gray-500 hover:underline" onClick={toggleShowFullCaption}> Thêm</button>
                            )}
                            {showFullCaption && (
                                <button className="text-gray-500 hover:underline" onClick={toggleShowFullCaption}> Ẩn</button>
                            )}
                        </p>
                    )}



                </Typography>
            </CardContent>
            <div className='flex flex-col gap-4'>
                {!item.video || !item.image ? (
                    <div className='w-full'>
                        {item.image && <img className='w-full h-auto' src={item.image} alt="" />}
                        {item.video && (
                            <video className='w-full h-auto' controls>
                                <source src={item.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                ) : (
                    <div className='h-10rem w-10rem'>
                        {item.video && item.image && (
                            <div className='flex flex-row gap-4'>
                                <img className='w-1/2 h-auto' src={item.image} alt="" />
                                <video className='w-1/2 h-auto' controls>
                                    <source src={item.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CardActions disableSpacing className='flex justify-between'>
                <div>
                    <Typography variant="body2" color="textSecondary" onClick={handleOpenLikedUsersDialog} style={{ cursor: 'pointer' }}>
                        {numLikes + " lượt thích "}
                        {item.comments?.length + " bình luận"}
                    </Typography>
                    <Dialog open={openLikedUsersDialog} onClose={handleCloseLikedUsersDialog}>
                        <DialogTitle>Được thích bởi</DialogTitle>
                        <DialogContent>

                            {item.liked?.map(user => (

                                <div key={user.id} >
                                    <Link to={`/profile/${user.id}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }} className='gap-2 ' >
                                        <Avatar style={{ width: '30px', height: '30px' }} src={user?.avatar}></Avatar>
                                        <Typography>{user.firstName} {user.lastName}</Typography>
                                    </Link>
                                </div>
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseLikedUsersDialog}>Đóng</Button>
                        </DialogActions>
                    </Dialog>
                    <IconButton className="hover:text-red-500" onClick={handleLikePost}>
                        {isLikedByRegUser(auth.user?.id, item) ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon style={{ color: 'red' }} />}
                    </IconButton>
                    <IconButton className="hover:text-blue-400" onClick={handleShowComment}>
                        <ChatBubbleOutlineIcon style={{ color: 'blue' }} />
                    </IconButton>
                    <IconButton>
                        <ShareIcon style={{ color: 'lightblue' }} />
                    </IconButton>
                </div>
                <div>

                    <IconButton className="hover:text-yellow-400" onClick={toggleSaveConfirmation}>
                        {isSaved ?
                            <Tooltip title="Unsave post">
                                <BookmarkIcon style={{ color: 'yellow' }} />
                            </Tooltip>
                            :
                            <Tooltip title="Save post">
                                <BookmarkBorderIcon style={{ color: 'yellow' }} />
                            </Tooltip>
                        }
                    </IconButton>
                </div>
            </CardActions>
            {
                showComments && (
                    <section className={`  overflow-y-scroll ${showFullComment ? 'max-h-full' : 'max-h-80'}`}>
                        <Divider />

                        <div className='mx-3 space-y-2 my-5 text-xs'>
                            {comments?.map((comment) => (
                                <div className='flex flex-row' key={comment?.id}>
                                    {/* {console.log('Check comment', comments)} */}
                                    <div className='flex items-center space-x-5 border rounded-3xl mb-5 p-2 bg-gradient-to-r from-sky-400' >

                                        <Link to={`/profile/${comment?.user?.id}`}>
                                            <Tooltip title={
                                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
                                                    <Avatar style={{ marginRight: '10px', width: '50px', height: '50px' }} src={comment.user?.avatar} />

                                                    <div>
                                                        <p>{comment.user?.firstName + " " + comment.user?.lastName}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <p>{comment.user?.followers?.length} followers</p>
                                                            <p style={{ margin: '0 10px' }}>•</p>
                                                            <p>{comment.user?.followings?.length} followings</p>
                                                        </div>
                                                        {/* Thêm các thông tin khác bạn muốn hiển thị */}
                                                    </div>
                                                </div>
                                            }>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: '#191c29',
                                                        color: 'rgb(88,199,250)',
                                                        fontSize: '.8rem'
                                                    }}
                                                    aria-label="recipe"
                                                    src={comment.user?.avatar}>
                                                </Avatar>
                                            </Tooltip>
                                        </Link>

                                        <div className='flex flex-col  '>
                                            <Typography className='text-xs' variant="body2" color="text.secondary">
                                                {formatCreatedAt(comment?.createAt)}
                                            </Typography>
                                            <Link to={`/profile/${comment?.user?.id}`}>
                                                <p className='font-bold text-base hover:underline'>{comment.user?.firstName} {comment.user?.lastName}</p>
                                            </Link>

                                            <Typography variant="body2" color="text.secondary"  >
                                                <p className=' text-black max-w-96 break-words whitespace-pre-line'>
                                                    {showFullComment ? comment?.content : (comment.content?.length > 50 ? comment.content.slice(0, 30) + '...' : comment?.content)}
                                                    {comment.content?.length > 50 && (
                                                        <button className="text-gray-500 hover:underline" onClick={toggleCommentExpansion}>
                                                            {showFullComment ? ` Ẩn` : 'Thêm'}
                                                        </button>
                                                    )}
                                                </p>
                                            </Typography>
                                        </div>
                                        <div className='flex flex-col'>
                                            <IconButton className='' onClick={() => handleLikeComment(comment.id)}>
                                                {isCommentLiked(comment.id) ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon style={{ color: 'red' }} />}

                                            </IconButton>
                                            <p className='ml-4'>{commentLikes[comment.id]}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className=' flex items-center space-x-5 mx-3 my-5 pl-2 '>
                            <Avatar
                                sx={{
                                    bgcolor: '#191c29',
                                    color: 'rgb(88,199,250)',
                                    fontSize: '.8rem'
                                }}
                                aria-label="recipe"
                                src={auth.user?.avatar}>

                            </Avatar>
                            <TextareaAutosize
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleCreateComment(commentContent);
                                    }
                                }}
                                onInput={handleTextareaChange}
                                rows={commentRows}
                                className='w-full border rounded px-4 py-2 resize-y bg-transparent rounded-3xl bg-gray-700'
                                placeholder='Write your comment...'
                            />
                            <IconButton >
                                <SendIcon style={{ color: 'blue', fontSize: '30px' }} className='cursor-pointer ' onClick={() => handleCreateComment(commentContent)} />
                            </IconButton>



                            <IconButton ref={insertEmoticonRef} onClick={handleEmojiIconClick}>
                                <InsertEmoticonIcon style={{ color: 'yellow', fontSize: '30px' }} />
                            </IconButton>

                        </div>

                        {showEmojiPicker && (
                            <div className='emoji-picker  ' >
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </section>
                )
            }
            <Snackbar open={showSaveError} autoHideDuration={6000} onClose={handleCloseSaveError}>
                <Alert onClose={handleCloseSaveError} severity="error">
                    Error occurred while saving post!
                </Alert>
            </Snackbar>
            <Snackbar open={showDeleteError} autoHideDuration={6000} onClose={handleCloseDeleteError}>
                <Alert onClose={handleCloseDeleteError} severity="error">
                    Error occurred while deleting post!
                </Alert>
            </Snackbar>
            <Dialog
                open={showDeleteConfirmation}
                onClose={toggleDeleteConfirmation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Xóa bài đăng?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có muốn xóa bài đăng này không ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDeleteConfirmation}>Hủy</Button>
                    <Button onClick={handleDeletePost} autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={showSaveConfirmation}
                onClose={toggleSaveConfirmation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Lưu bài?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {isSaved ? 'Bạn có muốn hủy lưu bài đăng này không ?' : 'Bạn có muốn lưu bài đăng này không ?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleSaveConfirmation}>Hủy</Button>
                    <Button onClick={handleSavePost} autoFocus>
                        {isSaved ? 'Hủy lưu' : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card >
    );
});

export default PostCard;
