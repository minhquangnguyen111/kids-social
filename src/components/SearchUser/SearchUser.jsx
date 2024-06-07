import { Avatar, Card, CardHeader } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { searchUser } from '../../Redux/Auth/auth.action';
import { createChat } from '../../Redux/Message/message.action';
import { Link } from 'react-router-dom';

const SearchUser = () => {
    const [username, setUsername] = useState("");
    const dispatch = useDispatch();
    const { message, auth } = useSelector(store => store);

    const handleSearchUser = (e) => {
        setUsername(e.target.value)
        console.log("Search user-------->", auth.searchUser)
        dispatch(searchUser(username))
    }
    const handleClick = (id) => {
        dispatch(createChat({ userId: id }))
    }
    return (
        <div>
            <div className='py-5 relative'>
                <input className='bg-transparent border border-[#3b4054] outline-none w-full px-5 py-3 rounded-full ' placeholder='Tìm bạn...' onChange={handleSearchUser} type="text"
                />
                {username && (
                    auth.searchUser.map((item) =>
                        <Card key={item.id} className='absolute w-full z-10 top-[4.5rem] cursor-pointer '>
                            <CardHeader onClick={() => {
                                handleClick(item.id)
                                setUsername("")
                            }}
                                avatar={
                                    <Link to={`/profile/${item.id}`}>
                                        <Avatar
                                            sx={{
                                                bgcolor: '#191c29',
                                                color: 'rgb(88,199,250)',
                                                fontSize: '1rem'
                                            }}
                                            aria-label="recipe"
                                            src={item.avatar}

                                        />
                                    </Link >}

                                title={
                                    <Link to={`/profile/${item.id}`}>
                                        <p>{item.firstName + " " + item.lastName}</p>
                                    </Link>
                                }
                                subheader={item.email.split('@')[0]} // Sửa thành `@${item.email.split('@')[0]}
                            />
                        </Card>)
                )}

            </div>


        </div>
    );
};

export default SearchUser