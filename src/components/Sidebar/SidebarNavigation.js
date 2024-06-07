import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';


export const navigationMenu = [
    
    {
        title: "Home",
        icon: <HomeIcon style={{ fontSize:'30px', color: '#3698d2'}}/>,
        path: "/"
    },
    {
        title: "Reels",
        icon: <MovieIcon style={{ fontSize: '30px', color: '#3698d2' }} />,
        path: "/reels"
    },
    {
        title: "Create Reels",
        icon: <ControlPointIcon style={{ fontSize: '30px', color: '#3698d2' }} />,
        path: "/create-reels"
    },
    {
        title: "Notifications",
        icon: <NotificationsIcon style={{ fontSize: '30px', color: '#3698d2' }} />,
        path: "/notifications"
    },
    {
        title: "Message",
        icon: <MessageIcon style={{ fontSize: '30px', color: '#3698d2' }} />,
        path: "/message"
    },
    {
        title: "Lists",
        icon: <ListAltIcon style={{ fontSize: '30px', color: '#3698d2' }} />,
        path: "/"
    },
    {
        title: "Communities",
        icon: <GroupIcon style={{ fontSize: '30px', color: '#3698d2' }} />,
        path: "/communities"
    },
    {
        title: "Profile",
        icon: <AccountCircleIcon style={{ fontSize: '30px', color: '#3698d2' }} />,
        path: "/profile"
    },
]
