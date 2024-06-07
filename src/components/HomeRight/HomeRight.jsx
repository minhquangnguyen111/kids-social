import React, { useEffect } from 'react';
import SearchUser from '../SearchUser/SearchUser';
import PopularUserCard from './PopularUserCard';
import { Card } from '@mui/material';

const HomeRight = ({ popularUsers, onFollowUser, loggedInUserId }) => {
    useEffect(() => {
        
    }, [popularUsers]);
    return (
        <div className='pr-1 '>
            <SearchUser />
            <Card className='p-5 '>
                <div className='flex justify-between py-5 items-center'>
                    <p className='font-semibold opacity-70'>Các người khác</p>
                    <p className='text-xs font-semibold opacity-95'>Xem tất cả</p>
                </div>
                <div className=''>
                    {popularUsers.map((user) => (
                        <PopularUserCard
                            // key={user.id}
                            user={user}

                            onFollowUser={() => onFollowUser(user.id)}
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default HomeRight;
