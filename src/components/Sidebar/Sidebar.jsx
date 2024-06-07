import React from 'react';
import { Avatar, Button, Card, Divider, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { navigationMenu } from './SidebarNavigation';
import Logout from './../../pages/Authentication/Logout';
import { logoutUserAction } from '../../Redux/Auth/auth.action';


const Sidebar = () => {
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (item) => {
        if (item.title === "Profile") {
            navigate(`/profile/${auth.user?.id}`)
        } else if (item.title === "Message") {
            navigate('/message');
        } else if (item.title === "Home" || item.title === "Student Online") {
            navigate('/');
        } else if (item.title === "Reels") {
            navigate('/reels');
        } else if (item.title === "Create Reels") {
            navigate('create-reels');
        } else if (item.title === "Communities") {
            navigate('/communities');
        }
    };

    const handleLogout = () => {
        dispatch(logoutUserAction());
        handleClose();
        navigate('/login');
    };

    const handleClickNotifications = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setAnchorEl(null);
    };

    return (
        <Card className="card h-screen flex flex-col justify-between py-5 ">
            <div className="space-y-8 pl-5 pr-5 ">
                <Link to="/" >
                    <span className='text text-center text-xs '>KIDS SOCIAL</span>
                    {/* <img src="https://res.cloudinary.com/datbut4zs/image/upload/v1715164152/keycmbsiupjttuibakdm.png" alt="" className='size-32'/> */}
                </Link>
                {/* Cac icon */}
                <div className='space-y-8 '>
                    {/* Thêm event onClick vào các icon */}
                    {navigationMenu.map((item) =>
                        <div key={item.title} onClick={() => handleNavigate(item)} className='cursor-pointer flex space-x-3 items-center hover:scale-105 '>
                            <span className="text-xl transition duration-300 transform hover:scale-110">{item.icon}</span>
                            <p className='text-xl'>{item.title}</p>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <Divider />
                <div className='pl-5 flex items-center justify-between pt-5'>
                    <div className='flex items-center space-x-3'>
                        <Avatar
                            sx={{
                                bgcolor: '#191c29',
                                color: 'rgb(88,199,250)',
                                fontSize: '1rem'
                            }}
                            aria-label="recipe"
                            src={auth.user.avatar}>

                        </Avatar>
                        <div>
                            <p className='text-xl font-bold '>{auth.user?.firstName + " " + auth.user?.lastName}</p>
                            <p className='opacity-70'>{auth.user?.email.split('@')[0]}</p>
                        </div>
                    </div>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <Logout />
                    </Menu>
                </div>
            </div>
        </Card>
    )
}

export default Sidebar;