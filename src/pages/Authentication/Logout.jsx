import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUserAction } from '../../Redux/Auth/auth.action';
import { toast } from 'react-toastify';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUserAction()); // Gọi action logout
        navigate("/")
    };

    return (
        <Button onClick={handleLogout} className=''>
            <LogoutIcon />
            <p > Logout </p>
        </Button>
    );
};

export default Logout;