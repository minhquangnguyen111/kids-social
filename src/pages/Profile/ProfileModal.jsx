import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { updateProfileAction } from '../../Redux/Auth/auth.action';
import { Avatar, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import sensitiveWords from './../../Utils/sensitiveWords';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    boxShadow: 24,
    p: 2,
    outline: 'none',
    overflow: "scroll-y",
    borderRadius: 3,
    bgcolor: '#CDE8E5'
};

const validationSchema = object({
    firstName: string()
        .max(10, "First Name must be at most 10 characters")
        .matches(/^[a-zA-Z\sáàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]*$/, "First Name must contain only letters.")
        .required('First Name is required'),
    lastName: string()
        .max(10, "Last Name must be at most 10 characters")
        .matches(/^[a-zA-Z\sáàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]*$/, "Last Name must contain only letters")
        .required('Last Name is required'),

    bio: string().max(200, 'Bio must be at most 200 characters') // Giới hạn độ dài của bio là 200 kí tự
});

export default function ProfileModal({ open, handleClose }) {
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);

    const formik = useFormik({
        initialValues: {
            firstName: auth.user?.firstName || "",
            lastName: auth.user?.lastName || "",
            gender: auth.user?.gender || "",
            bio: auth.user?.bio || "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const { firstName, lastName, bio, gender } = values;
            const reqData = { firstName, lastName, bio, gender };

            try {
                // Kiểm tra từ nhạy cảm
                if (checkSensitiveWords(firstName) || checkSensitiveWords(lastName) || checkSensitiveWords(bio)) {
                    toast.warning('Thông tin cá nhân không được chứa nội dung không phù hợp!');
                    return;
                }

                const success = await dispatch(updateProfileAction(reqData));
                if (success) {
                    handleClose();
                }
            } catch (error) {
                console.error("Error submitting profile update:", error);
            }
        }
    });

    // Hàm kiểm tra từ nhạy cảm
    const checkSensitiveWords = (text) => {
        for (let word of sensitiveWords) {
            // Sử dụng biểu thức chính quy để kiểm tra từ riêng lẻ
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            if (regex.test(text)) {
                return true;
            }
        }
        return false;
    };

    return (
        <div>
            <Modal open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal--title"
                aria-describedby="modal-modal-decription"
            >
                <Box sx={style}>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <IconButton onClick={handleClose}>
                                    <CloseIcon style={{ color: 'red' }} />
                                </IconButton>
                                <Typography variant="h6">Sửa thông tin cá nhân</Typography>
                            </div>
                            <Button type="submit">Lưu</Button>
                        </div>
                        <div className='m-5'>
                            <TextField sx={{ marginBottom: '20px' }}
                                fullWidth
                                id="firstName"
                                name="firstName"
                                label="First Name"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                            <TextField sx={{ marginBottom: '20px' }}
                                fullWidth
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                            <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={formik.values.gender}
                                    onChange={formik.handleChange}
                                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                                {formik.touched.gender && formik.errors.gender && (
                                    <FormHelperText error>{formik.errors.gender}</FormHelperText>
                                )}
                            </FormControl>
                            <TextField
                                fullWidth
                                id="bio"
                                name="bio"
                                label="Bio"
                                multiline
                                rows={4}
                                value={formik.values.bio}
                                onChange={formik.handleChange}
                                error={formik.touched.bio && Boolean(formik.errors.bio)}
                                helperText={formik.touched.bio && formik.errors.bio}
                            />
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
