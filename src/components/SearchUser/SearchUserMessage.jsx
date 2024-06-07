import { Avatar, Card, CardHeader } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUser } from '../../Redux/Auth/auth.action';
import { createChat } from '../../Redux/Message/message.action';

const SearchUserMessage = ({ setCurrentChat, setMessages }) => {
   const [username, setUsername] = useState("");
   const dispatch = useDispatch();
   const { message, auth } = useSelector(store => store);

   const handleSearchUser = (e) => {
      setUsername(e.target.value);
      dispatch(searchUser(e.target.value));
   };

   const handleClick = async (user) => {
      const existingChat = message.chats.find(chat =>
         chat.users.some(chatUser => chatUser.id === user.id)
      );

      if (existingChat) {
         setCurrentChat(existingChat);
         setMessages(existingChat.messages);
      } else {
         // Tạo cuộc trò chuyện mới nếu không tồn tại
         try {
            const newChat = await dispatch(createChat({ userId: user.id })).unwrap(); // unwrap để lấy kết quả từ createChat
            setCurrentChat(newChat);
            setMessages(newChat.messages || []); // Xử lý trường hợp messages không tồn tại
         } catch (error) {
            console.error("Failed to create chat:", error);
         }
      }
      setUsername("");
   };

   return (
      <div>
         <div className='py-5 relative'>
            <input
               className='bg-transparent border border-[#3b4054] outline-none w-full px-5 py-3 rounded-full'
               placeholder='Search user...'
               onChange={handleSearchUser}
               type="text"
               value={username}
            />
            {username && (
               auth.searchUser.map((item) => (
                  <Card key={item.id} className='absolute w-full z-10 top-[4.5rem] cursor-pointer'>
                     <CardHeader
                        onClick={() => handleClick(item)}
                        avatar={
                           <Avatar
                              sx={{
                                 bgcolor: '#191c29',
                                 color: 'rgb(88,199,250)',
                                 fontSize: '1rem'
                              }}
                              src={item.avatar}
                           />
                        }
                        title={`${item.firstName} ${item.lastName}`}
                        subheader={`@${item.email.split('@')[0]}`}
                     />
                  </Card>
               ))
            )}
         </div>
      </div>
   );
};

export default SearchUserMessage;
