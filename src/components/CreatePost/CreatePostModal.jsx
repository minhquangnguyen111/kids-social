import { Avatar, Backdrop, Box, Button, CircularProgress, IconButton, Menu, Modal } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { uploadToCloudinary } from '../../Utils/upLoadToCloudniry';
import CloseIcon from '@mui/icons-material/Close';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'; // Import icon InsertEmoticonIcon

import { createPostAction } from '../../Redux/Post/post.action';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import EmojiPicker from 'emoji-picker-react';
import sensitiveWords from '../../Utils/sensitiveWords';
import { toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'rgba(255, 255, 255)',
    boxShadow: 24,
    p: 4,
    borderRadius: ".6rem",
    outline: "none"
};

const CreatePostModal = ({ handleClose, open }) => {
    const { auth } = useSelector(store => store);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Thêm state để hiển thị emoji picker
    const [anchorEl, setAnchorEl] = useState(null); // Thêm state cho anchorEl của menu emoji
    const dispatch = useDispatch();

    const handleSelectImage = async (event) => {
        setIsLoading(true);
        const imageUrl = await uploadToCloudinary(event.target.files[0], "image");
        setSelectedImage(imageUrl);
        setIsLoading(false);
        formik.setFieldValue("image", imageUrl);
    };

    const handleSelectVideo = async (event) => {
        setIsLoading(true);
        const videoUrl = await uploadToCloudinary(event.target.files[0], "video");
        setSelectedVideo(videoUrl);
        setIsLoading(false);
        formik.setFieldValue("video", videoUrl);
    };

    const validationSchema = Yup.object().shape({
        caption: Yup.string().max(2550, 'Caption must not exceed 2550 characters!'),
    });

    const formik = useFormik({
        initialValues: {
            caption: "",
            image: "",
            video: ""
        },
        validationSchema: validationSchema, // Thêm validationSchema vào đây
        onSubmit: async (values) => {
            // Kiểm tra xem caption có chứa từ nhạy cảm không
            const containsSensitiveWord = sensitiveWords.some(word => {
                const regex = new RegExp(`(^|\\s)${word}(\\s|$)`, 'i');
                return regex.test(values.caption);
            });

            // Nếu caption chứa từ nhạy cảm, hiển thị cảnh báo
            if (containsSensitiveWord) {
                toast.warning('Caption chứa nội dung không phù hợp!');
                return;
            }

            if (!values?.caption && !values?.image && !values?.video) {
                alert("Hãy thêm caption hoặc thêm vào hình ảnh hoặc video.");
                return;
            }

            console.log("formik values", values);
            await dispatch(createPostAction(values));
            formik.setFieldValue("caption", "");
            handleClose();
        }
    });

    // Hàm xử lý khi chọn emoji
    const handleEmojiClick = (emojiObject) => {
        const emojiString = emojiObject.emoji;
        formik.setFieldValue("caption", formik.values.caption + emojiString);
    };

    // Mở menu emoji picker
    const handleOpenEmojiPicker = (event) => {
        setAnchorEl(event.currentTarget);
        setShowEmojiPicker(true);
    };

    // Đóng menu emoji picker
    const handleCloseEmojiPicker = () => {
        setAnchorEl(null);
        setShowEmojiPicker(false);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <div className='flex space-x-4 items-center'>
                            <Avatar
                                sx={{
                                    bgcolor: '#191c29',
                                    color: 'rgb(88,199,250)',
                                    fontSize: '.8rem'
                                }}
                                aria-label="recipe"
                                src={auth.user.avatar}
                            />
                            <div>
                                <p className='font-bold text-lg'>{auth.user?.firstName + ' ' + auth.user?.lastName}</p>
                                <p className='text-sm'>{auth.user.email.split('@')[0]}</p>
                            </div>
                        </div>
                        <textarea
                            className='outline-none w-full mt-5 p-2 
    bg-transparent border border-[#b2cc5c] rounded-sm'
                            placeholder='Caption...'
                            name="caption"
                            id=""
                            onChange={formik.handleChange}
                            value={formik.values.caption}
                            cols="4"
                            rows="10"
                        />
                        {/* Hiển thị thông báo lỗi sau ô input */}
                        {formik.touched.caption && formik.errors.caption && (
                            <div className="text-red-500">{formik.errors.caption}</div>
                        )}
                        <div className='flex space-x-5 items-center mt-5 text-xl'>
                            <div>
                                <label htmlFor="image-input">
                                    <IconButton className='' color="success" component="span">
                                        <ImageIcon />
                                    </IconButton>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="image-input"
                                    style={{ display: "none" }}
                                    onChange={handleSelectImage}
                                />
                                <span>Ảnh</span>
                            </div>

                            <div>
                                <label htmlFor="video-input">
                                    <IconButton color="warning" component="span">
                                        <VideoCallIcon />
                                    </IconButton>
                                </label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    id="video-input"
                                    style={{ display: "none" }}
                                    onChange={handleSelectVideo}
                                />
                                <span>Video</span>
                            </div>

                            {/* Thêm InsertIconButton cho emoji */}
                            <div>
                                <IconButton color='warning' onClick={handleOpenEmojiPicker}>
                                    <InsertEmoticonIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={showEmojiPicker}
                                    onClose={handleCloseEmojiPicker}
                                >
                                    <div className=''>
                                        {/* Hiển thị danh sách emoji */}
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </div>
                                </Menu>
                            </div>
                        </div>
                        <div className='flex flex-row gap-4'>
                            {selectedImage && (
                                <div className="relative">
                                    {/* Hiển thị ảnh */}
                                    <img src={selectedImage} alt="Selected Image" className="h-[10rem] object-cover" />
                                    <IconButton
                                        className="absolute top-0 right-0"
                                        onClick={() => setSelectedImage(null)} // Xóa ảnh khi nút được nhấn
                                        style={{ zIndex: 1 }} // Đảm bảo nút được đặt trên cùng
                                    >
                                        <CloseIcon style={{ color: "red" }} />
                                    </IconButton>
                                </div>
                            )}

                            {selectedVideo && (
                                <div className="relative">
                                    {/* Hiển thị video */}
                                    <video controls className='h-[10rem]'>
                                        <source src={selectedVideo} type='video/mp4' />
                                        Your browser does not support the video tag.
                                    </video>
                                    <IconButton
                                        className="absolute top-0 right-0"
                                        onClick={() => setSelectedVideo(null)} // Xóa video khi nút được nhấn
                                        style={{ zIndex: 1 }} // Đảm bảo nút được đặt trên cùng
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            )}
                        </div>
                        <div className='flex w-full justify-end'>
                            <Button variant='contained' type='submit' sx={{ borderRadius: "1.5rem" }}>Đăng </Button>
                        </div>
                    </div>
                </form>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                    onClick={handleClose}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        </Modal>
    );
}

export default CreatePostModal;