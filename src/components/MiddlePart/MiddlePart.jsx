import { Avatar, Card, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import ArticleIcon from '@mui/icons-material/Article';
import PostCard from '../Post/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPostAction } from '../../Redux/Post/post.action';
import CreatePostModal from './../CreatePost/CreatePostModal';
import StoryCircle from './StoryCircle';
import { createStory } from '../../Redux/Auth/auth.action';

const story = [1, 1, 1, 1, 1];

const MiddlePart = () => {
    const { auth, post } = useSelector(store => store);
    const dispatch = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
    const [contentType, setContentType] = useState(null);
    const { users } = useSelector(store => store);
    const [selectedFile, setSelectedFile] = useState(null);
    const [storyData, setStoryData] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const handleUploadFile = () => {
        // Kiểm tra xem đã chọn file chưa
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Gửi dữ liệu ảnh hoặc video lên server để tạo story
            dispatch(createStory(formData));

            // Sau khi tạo story thành công, cập nhật danh sách stories
            // Tạm thời tạo dữ liệu story mẫu
            const newStory = {
                id: storyData.length + 1,
                url: URL.createObjectURL(selectedFile)
            };

            setStoryData([...storyData, newStory]);

            // Đặt lại selectedFile về null sau khi đã tạo story
            setSelectedFile(null);
        }
    };
    useEffect(() => {
        dispatch(getAllPostAction());
    }, [dispatch]);


    useEffect(() => {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (auth.isAuthenticated) {
            setIsLoggedIn(true);
            dispatch(getAllPostAction());
        }
    }, [auth.isAuthenticated, dispatch]);
    return (
        <div className='px-20 ml-6 '>
            {/* StoryCircle components */}
            <section className='flex items-center p-5 rounded-b-md'>
                <div className='flex flex-col items-center mr-4 cursor-pointer'>
                    <Avatar sx={{ width: "5rem", height: "5rem" }}>
                        <AddIcon sx={{ fontSize: "3rem" }} />
                    </Avatar>
                    <p>Mới</p>
                </div>
                <StoryCircle users={users} />
            </section>
            <Card className='p-5 mt-5'>
                <div className='flex justify-between'>
                    <Avatar
                        sx={{
                            bgcolor: '#191c29', // Màu nền là màu đỏ
                            color: 'rgb(88,199,250)', // Màu chữ là màu trắng
                            fontSize: '.8rem' // Kích thước chữ
                        }}
                        aria-label="recipe"
                        src={auth.user.avatar}>

                    </Avatar>
                    <input
                        onClick={() => setOpenCreatePostModal(true)}
                        readOnly
                        className='outline-none w-[90%] rounded-full px-5 bg-transparent border-[#3b4054] border'
                        type="text"
                        placeholder="What's on your mind?" />
                </div>
                <div className='px-10 flex justify-center space-x-9 mt-5'>
                    <div className='flex items-center flex-grow'>
                        <IconButton color="primary" onClick={() => setOpenCreatePostModal(true)}>
                            <ImageIcon fontSize="large" color='success' />
                        </IconButton>
                        <span className="text-lg ">Ảnh</span>
                    </div>
                    <div className='flex items-center flex-grow'>
                        <IconButton color="primary" onClick={() => setOpenCreatePostModal(true)}>
                            <VideocamIcon fontSize="large" color='warning' />
                        </IconButton>
                        <span className="text-lg">Video</span>
                    </div>
                    <div className='flex items-center flex-grow'>
                        <IconButton color="primary" onClick={() => setOpenCreatePostModal(true)}>
                            <ArticleIcon fontSize="large" />
                        </IconButton>
                        <span className="text-lg ">Viết bài</span>
                    </div>
                </div>
            </Card>
            <div className='mt-5 space-y-5  '>
                {post.posts.length > 0 ? (
                    post.posts.map((item) => <PostCard key={item.id} item={item} />)
                ) : (
                    <p>No posts found.</p>
                )}
            </div>
            <div>
                <CreatePostModal
                    handleClose={() => setOpenCreatePostModal(false)}
                    open={openCreatePostModal}
                    contentType={contentType}
                />
            </div>
        </div>
    );
}

export default MiddlePart;