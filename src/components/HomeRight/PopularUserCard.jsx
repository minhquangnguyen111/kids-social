import { Avatar, Button, CardHeader, Tooltip } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser } from './../../Redux/Auth/auth.action';
import { isFollowedByRegUser } from './../../Utils/IsFollowedByReqUser';
import { Link } from 'react-router-dom';

const PopularUserCard = ({ user }) => {
    const { id, firstName, lastName, email } = user;
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();

    const title = `${firstName} ${lastName}`;
    const subheader = `${email ? email.split('@')[0] : ''}`;


    const truncateTitle = (title) => {
        if (title.length > 10) {
            return title.slice(0, 10) + '...';
        }
        return title;
    };

    const handleFollowButtonClick = () => {
        dispatch(followUser(id));
    };

    return (
        <div>
            <CardHeader className='hover:scale-105  '
                avatar={
                    <Link to={`/profile/${id}`}>
                        <Tooltip title={
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
                                <Avatar style={{ marginRight: '10px', width: '50px', height: '50px' }} src={user?.avatar} />

                                <div>
                                    <p>{user?.firstName + " " + user?.lastName}</p>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <p>{user?.followers?.length} người theo dõi</p>
                                        <p style={{ margin: '0 10px' }}>•</p>
                                        <p>{user?.followings.length} đang theo dõi</p>
                                    </div>

                                </div>
                            </div>
                        }>
                            <Avatar className='right-2'
                                sx={{
                                    bgcolor: '#191c29',
                                    color: 'rgb(88,199,250)',
                                    fontSize: '13px'
                                }}
                                aria-label="recipe"
                                src={user.avatar}
                            />
                        </Tooltip>
                    </Link>
                }
                action={
                    <Button className='left-4 ' size='small' onClick={handleFollowButtonClick}>
                        {isFollowedByRegUser(auth.user.id, user) ? 'Hủy theo dõi' : 'Theo dõi'}
                    </Button>
                }
                title={
                    <Link to={`/profile/${id}`}>

                        {truncateTitle(title)}
                    </Link>
                }
                subheader={subheader}
                key={id}
            />
        </div>
    );
};

export default PopularUserCard;
