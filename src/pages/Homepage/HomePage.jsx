import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Profile from '../Profile/Profile.jsx';
import CreateReelsForm from '../../components/Reels/CreateReelsForm.jsx';
import Reels from '../../components/Reels/Reels.jsx';
import MiddlePart from '../../components/MiddlePart/MiddlePart.jsx';
import HomeRight from '../../components/HomeRight/HomeRight.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileAction } from '../../Redux/Auth/auth.action.js';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api.js';
import GameState from '../../components/SnakeGame/GameState.jsx';
import Communities from '../../components/Communities/Communities.jsx';

function HomePage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const jwt = localStorage.getItem("jwt");
    const { auth } = useSelector(store => store);
    const [popularUsers, setPopularUsers] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPopularUsers = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    }
                };
                const response = await axios.get(`${API_BASE_URL}/api/users`, config);
                const filteredUsers = response.data.filter(user => user.email !== auth.user.email);
                const followingUserIds = auth.user.followings.map(user => user.id);
                const usersWithFollowStatus = filteredUsers.map(user => ({
                    ...user,
                    isFollowing: followingUserIds.includes(user.id)
                }));
                setPopularUsers(usersWithFollowStatus);
            } catch (error) {
                console.error('Error fetching popular users:', error);
            }
        };

        fetchPopularUsers();
    }, [auth, jwt]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    }
                };
                const response = await axios.get(`${API_BASE_URL}/api/posts`, config);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [jwt]);

    const handleFollowUser = async (userId) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            };
            const response = await axios.put(`${API_BASE_URL}/api/users/follow/${userId}`, {}, config);
            const updatedUser = response.data;
            const updatedPopularUsers = popularUsers.map(user => {
                if (user.id === updatedUser.id) {
                    return {
                        ...user,
                        isFollowing: !user.isFollowing // Toggle trạng thái follow
                    };
                }
                return user;
            });
            setPopularUsers(updatedPopularUsers);
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        }
    };

    return (
        <div className='px-10'>
            <Grid container spacing={3}>
                <Grid item xs={0} lg={3}>
                    <div className='sticky top-0'>
                        <Sidebar />
                    </div>
                </Grid>
                <Grid
                    lg={location.pathname === "/" ? 6 : 9}
                    item
                    className='px-5 flex justify-center' xs={12}>
                    <Routes>
                        <Route path="/" element={<MiddlePart posts={posts} />} />
                        <Route path="/reels" element={<Reels />} />
                        <Route path="/create-reels" element={<CreateReelsForm />} />
                        <Route path="/profile/:id" element={<Profile />} />
                        <Route path="/communities" element={<Communities />} />
                        <Route path="/snake-game" element={<GameState />} />
                    </Routes>
                </Grid>
                {location.pathname === "/" &&
                    <Grid Grid item lg={3} className='relative'>
                        <div className='sticky top-0 w-full'>
                            <HomeRight
                                popularUsers={popularUsers}
                                onFollowUser={handleFollowUser}
                                loggedInUserId={auth.user.id}
                            />
                        </div>
                    </Grid>}
            </Grid>
        </div >
    )
}

export default HomePage;
