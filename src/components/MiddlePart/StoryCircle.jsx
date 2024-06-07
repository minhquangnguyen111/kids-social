import React, { useEffect } from 'react';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../Redux/Auth/auth.action';

const StoryCircle = () => {
    const dispatch = useDispatch();
    const { users } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    return (
        <div className="flex overflow-x-auto">
            {/* Kiểm tra xem users đã được khởi tạo chưa trước khi sử dụng map */}
            {users && users.slice(0, 5).map(user => (
                <div className='flex flex-col items-center mr-4 cursor-pointer' key={user.id}>
                    {/* <Avatar sx={{ width: "5rem", height: "5rem" }} src={user.avatar}>
                    </Avatar> */}
                    <Avatar
                        sx={{
                            bgcolor: '#191c29',
                            color: 'rgb(88,199,250)',
                            width: "5rem", height: "5rem"
                        }}
                        aria-label="recipe"
                        src={user.avatar}>

                    </Avatar>
                    <p className='text-sm'>{user.firstName} {user.lastName}</p>
                </div>
            ))}
        </div>
    );
};

export default StoryCircle;
