import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, Tab, Tabs, Modal, Tooltip, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PostCard from '../../components/Post/PostCard';
import UserReelsCard from '../../components/Reels/UserReelsCard';
import ProfileModal from './ProfileModal';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useDispatch, useSelector } from 'react-redux';
import { getUserReelsAction } from '../../Redux/Reels/reels.action';
import { createPostAction, getAllPostAction, savePostAction } from '../../Redux/Post/post.action.js';
import { LIKE_POST_FAILURE, LIKE_POST_SUCCESS } from '../../Redux/Post/post.actionType.js';
import AvatarModal from './AvatarModal';
import { UPDATE_USER_AVATAR_SUCCESS, UPDATE_USER_COVER_SUCCESS } from '../../Redux/Auth/auth.actionType.js';
import { uploadToCloudinary } from '../../Utils/upLoadToCloudniry.js';
import PanoramaIcon from '@mui/icons-material/Panorama';
import CoverModal from './CoverModal.jsx';
import './profile.css';
import { followUser, getUsers } from '../../Redux/Auth/auth.action.js';
import { isFollowedByRegUser } from '../../Utils/IsFollowedByReqUser.js';


const tabs = [
    { value: "post", name: "Post" },
    { value: "reels", name: "Reels" },
    { value: "saved", name: "Saved" },
    { value: "repost", name: "Repost" }
];

const Profile = () => {
    const { id } = useParams();
    const { auth, post } = useSelector(store => store);
    const [value, setValue] = useState('post');
    const [userPosts, setUserPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { userReels } = useSelector(state => state.reels);
    const [caption, setCaption] = useState("");
    const [openCoverModal, setOpenCoverModal] = useState(false);
    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const userId = parseInt(id);
    const handleCloseCoverModal = () => setOpenCoverModal(false);
    const [isFollowing, setIsFollowing] = useState(false);



    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    useEffect(() => {
        if (selectedUser) {
            setIsFollowing(isFollowedByRegUser(auth.user?.id, selectedUser));
        }
    }, [selectedUser, auth.user]);

    const handleFollowButtonClick = async () => {
        if (!selectedUser) return;

        try {
            // Dispatch followUser action
            await dispatch(followUser(selectedUser?.id));

            // Update isFollowing state
            setIsFollowing(!isFollowing);

            // Update follower count for selectedUser
            const updatedUser = { ...selectedUser };
            if (isFollowing) {
                // Nếu đang unfollow, giảm số lượng follower đi 1
                updatedUser.followers = updatedUser.followers.filter(userId => userId !== auth.user?.id);
            } else {
                // Nếu đang follow, tăng số lượng follower lên 1
                updatedUser.followers.push(auth.user?.id);
            }
            setSelectedUser(updatedUser);
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                setSelectedUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    useEffect(() => {
        fetchUserPosts(id);
        fetchSavedPosts(id);
    }, [id, post.newComment, post.like, post.newSave]);

    const handleOpenCoverModal = () => {
        setOpenCoverModal(true);
    };

    const handleLikePost = async (postId) => {
        await fetchUserPosts(id);
        await fetchSavedPosts(id);
        await fetchLikePosts(postId);
    };

    const handleCreateComment = async (postId, content) => {
        await fetchUserPosts(id);
        await fetchSavedPosts(id);
        await fetchLikePosts(postId);
    };

    const handleSavePost = async (postId) => {
        await fetchUserPosts(id);
        await fetchSavedPosts(id);
        await fetchLikePosts(postId);
    };

    const handleOpenProfileModal = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                handleModalOpen();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedCoverImage(reader.result);
                handleOpenCoverModal();
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            setSelectedUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleAvatarConfirmation = async (caption) => {
        try {
            const imageUrl = await uploadToCloudinary(selectedImage, 'image');

            const response = await axios.patch(
                `${API_BASE_URL}/api/users`,
                { avatar: imageUrl },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    }
                }
            );

            if (response.data) {
                const updatedUser = { ...auth.user, avatar: response.data.avatar };
                dispatch({ type: UPDATE_USER_AVATAR_SUCCESS, payload: updatedUser });

                setModalOpen(false);
                setSelectedImage(null);

                const postData = {
                    caption: caption,
                    image: imageUrl
                };

                await dispatch(createPostAction(postData));
                setUserPosts([postData, ...userPosts]);

                // Cập nhật thông tin người dùng sau khi cập nhật avatar thành công
                fetchUser();
            } else {
                console.error("Failed to update avatar: Response data is empty");
            }
        } catch (error) {
            console.error("Error updating avatar:", error);
        }
    };

    const handleCoverConfirmation = async (caption) => {
        try {
            const imageUrl = await uploadToCloudinary(selectedCoverImage, 'image');

            const response = await axios.patch(
                `${API_BASE_URL}/api/users`,
                { cover: imageUrl },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    }
                }
            );

            if (response.data) {
                const updatedUser = { ...auth.user, cover: response.data.cover };
                dispatch({ type: UPDATE_USER_COVER_SUCCESS, payload: updatedUser });

                setOpenCoverModal(false);
                setSelectedCoverImage(null);

                const postData = {
                    caption: caption,
                    image: imageUrl
                };

                await dispatch(createPostAction(postData));
                setUserPosts([postData, ...userPosts]);
                fetchUser();
            } else {
                console.error("Failed to update cover: Response data is empty");
            }
        } catch (error) {
            console.error("Error updating cover:", error);
        }
    };

    const fetchLikePosts = async (postId) => {
        try {
            const response = await axios.put(`/api/posts/like/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            dispatch({ type: LIKE_POST_SUCCESS, payload: response });
            await fetchUserPosts(id);
            await fetchSavedPosts(id);
        } catch (error) {
            console.log("Error", error);
            dispatch({ type: LIKE_POST_FAILURE, payload: error });
        }
    };

    const fetchUserPosts = async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/posts/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            setUserPosts(response.data || []);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    const fetchSavedPosts = async (userId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/posts/saved`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            const userSavedPosts = response.data.filter(post => post.user?.id === userId);
            setSavedPosts(userSavedPosts || []);

        } catch (error) {
            console.error('Error fetching saved posts:', error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchUserPosts(id);
        fetchSavedPosts(selectedUser ? selectedUser?.id : null);
    }, [id, selectedUser, post.newComment, post.like, post.newSave]);

    useEffect(() => {
        dispatch(getAllPostAction());
    }, [dispatch, post.newComment, post.newLike, post.newSave]);

    useEffect(() => {
        dispatch(getUserReelsAction(id));
    }, [dispatch, id]);

    useEffect(() => {
        fetchSavedPosts(userId);
    }, [userId, post.newSave]);

    return (
        <Card className='w-[80%]'>
            <div className='rounded-md'>
                <div className='h-[50rem]'>
                    <img
                        className='w-full h-full object-cover object-right rounded-t-md'
                        src={selectedUser ? selectedUser.cover : "https://source.unsplash.com/random"}
                        alt="Cover image"
                    />
                </div>
                <div className='px-5 flex justify-between items-start  h-[3rem]'>
                    <Avatar
                        className='transform -translate-y-32'
                        sx={{ width: "12rem", height: "12rem" }}
                        src={selectedUser ? selectedUser.avatar : ''}
                    />

                    {/* Edit Profile button */}
                    {auth.user.id === selectedUser?.id ? (
                        <div className='mt-24'>
                            <Button onClick={() => setOpen(true)} sx={{ borderRadius: "20px" }} variant='outlined' className='w-40'>Sửa thông tin</Button>
                            <div className='mt-3'>
                                <label htmlFor="avatar-upload" className='mr-2'>
                                    <input
                                        style={{ display: 'none' }}
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                    <Tooltip title="Update avatar">
                                        <Button component="span" sx={{ borderRadius: "20px" }} variant='outlined'>
                                            <CameraAltIcon />
                                        </Button>
                                    </Tooltip>
                                </label>

                                <label htmlFor="cover-upload">
                                    <input
                                        style={{ display: 'none' }}
                                        id="cover-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverChange}
                                    />
                                    <Tooltip title="Update cover image">
                                        <Button component="span" sx={{ borderRadius: "20px" }} variant='outlined'>
                                            <PanoramaIcon />
                                        </Button>
                                    </Tooltip>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <Button onClick={handleFollowButtonClick} sx={{ borderRadius: "20px" }} variant='outlined'>
                            {selectedUser && isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
                        </Button>
                    )}
                </div>
                <div className='p-5  '>
                    <div>
                        <h1 className='py-1 font-bold text-xl'>
                            {selectedUser && selectedUser.firstName ? selectedUser.firstName + " " + selectedUser.lastName : ''}
                        </h1>
                        <p>@{selectedUser ? selectedUser.email.split('@')[0] : " "}</p>
                    </div>
                    <div className='flex gap-5 items-center py-3 pb-2 mb-3'>
                        <span className='text-red-500'>{userPosts ? userPosts.length : " "} bài đăng</span>
                        <span className='text-green-500'>{selectedUser ? selectedUser.followers?.length : ''} người theo dõi</span>
                        <span className='text-blue-400 '>{selectedUser ? selectedUser.followings.length : ''} đang theo dõi</span>
                    </div>
                    <Divider className='text-purple-600 text-lg' textAlign="left">Tiểu sử</Divider>
                    <div className="bio-container max-w-xl break-words whitespace-pre-line mt-3">
                        {selectedUser ? selectedUser.bio : ''}
                    </div>
                </div>
                <section>
                    <div className="sticky-container">
                        <Box sx={{ width: '100%', borderBottom: 1, borderColor: "divider" }}>
                            <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
                                {tabs.map((item) =>
                                    <Tab key={item.value} value={item.value} label={item.name} wrapped />
                                )}
                            </Tabs>
                        </Box>
                    </div>
                    <div className='flex justify-center'>
                        {value === 'post' ? (
                            <div className='space-y-5 w-[80%] my-10'>
                                {userPosts.map((item, index) => (
                                    <div key={index} className="border border-slate-100 rounded-md">
                                        <PostCard
                                            item={item}
                                            savedPosts={savedPosts}
                                            handleLikePost={fetchLikePosts}
                                            handleCreateComment={fetchUserPosts}
                                            handleSavePost={fetchSavedPosts}
                                            savePostAction={savePostAction}
                                            userPosts={userPosts}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : value === "saved" ? (
                            <div className='space-y-5 w-[80%] my-10'>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    savedPosts.map((item, index) => (
                                        <div key={index} className="border border-slate-100 rounded-md">
                                            <PostCard
                                                item={item}
                                                savedPosts={savedPosts}
                                                handleLikePost={fetchLikePosts}
                                                handleCreateComment={fetchUserPosts}
                                                handleSavePost={fetchSavedPosts}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : value === 'reels' ? (
                            <div className='flex justify-center flex-wrap gap-2 my-10'>
                                {userReels && userReels.length > 0 ? (
                                    userReels.map((reel, index) => (
                                        <div key={index}>
                                            <UserReelsCard reel={reel} />
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có thước phim.</p>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </section>
            </div>
            <section>
                <ProfileModal open={open} handleClose={() => setOpen(false)} />
            </section>
            <AvatarModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                selectedImage={selectedImage}
                caption={caption}
                handleAvatarConfirmation={handleAvatarConfirmation}
            />
            <CoverModal
                openCoverModal={openCoverModal}
                handleCloseCoverModal={() => setOpenCoverModal(false)}
                selectedCoverImage={selectedCoverImage}
                handleCoverConfirmation={handleCoverConfirmation}
            />
        </Card>
    );
};

export default Profile;