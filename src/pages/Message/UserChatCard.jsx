import React, { useEffect, useState } from 'react';
import { Avatar, Card, CardHeader, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useDispatch, useSelector } from 'react-redux';
import { formatCreatedAt } from '../../components/Post/formatCreateAt';
import './Message.css';


const UserChatCard = ({ chat, updateLatestMessage }) => {
    const { auth } = useSelector(store => store);
    const [latestMessage, setLatestMessage] = useState(null);
    const [formatTime, setFormatTime] = useState(null);
    const [newMessage, setNewMessage] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const open = Boolean(anchorEl);

    useEffect(() => {
        if (newMessage) {
            updateLatestMessage(latestMessage);
        }
    }, [newMessage, latestMessage, updateLatestMessage]);

    useEffect(() => {
        if (chat.messages && chat.messages.length > 0) {
            const lastMessage = chat.messages[chat.messages.length - 1];
            setLatestMessage(lastMessage);
            setFormatTime(formatCreatedAt(lastMessage.timestamp));
            // Cập nhật trạng thái tin nhắn mới
            setNewMessage(true);
        } else {
            setLatestMessage(null);
            setFormatTime(null);
            // Không có tin nhắn mới
            setNewMessage(false);
        }
    }, [chat.messages]);

    const truncateMessage = (message) => {
        if (message && message.length > 15) {
            return message.slice(0, 15) + '...';
        }
        return message;
    };

    const formattedTime = latestMessage ? formatCreatedAt(latestMessage.timestamp) : null;

    return (
        <Card
            className={`cursor-pointer hover:bg-gradient-to-br from-emerald-500 to-cyan-500 `}
        >
            <CardHeader
                avatar={
                    <Avatar
                        sx={{
                            width: "3.5rem",
                            height: "3.5rem",
                            fontSize: "1rem",
                            bgcolor: "#191c29",
                            color: "rgb(88,199,250)"
                        }}
                        src={auth.user.id === chat.users[0].id ? chat.users[1].avatar : chat.users[0].avatar}
                    >
                    </Avatar>
                }
                action={
                    <>
                        <IconButton >
                            <MoreHorizIcon />
                        </IconButton>
                    </>
                }
                title={auth.user.id === chat.users[0].id ? chat.users[1].firstName + " " + chat.users[1].lastName : chat.users[0].firstName + " " + chat.users[0].lastName}
                subheader={
                    <>
                        {latestMessage && (
                            <>
                                <p className='text-gray-400'>
                                    {auth.user.id === latestMessage.user.id ? "Bạn: " : ""}
                                    {truncateMessage(latestMessage.content)}
                                </p>
                                <p className='text-gray-400'>{formattedTime}</p>
                            </>
                        )}
                        {!latestMessage && <p className='text-gray-400'>No message</p>}
                    </>
                }
            />
        </Card >
    )
}

export default UserChatCard;