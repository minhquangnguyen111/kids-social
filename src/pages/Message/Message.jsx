import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Backdrop, CircularProgress, Grid, IconButton, TextareaAutosize } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { useDispatch, useSelector } from 'react-redux';
import { createMessage, getAllChats } from '../../Redux/Message/message.action';
import { uploadToCloudinary } from './../../Utils/upLoadToCloudniry';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Link } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import UserChatCard from './UserChatCard';
import ChatMessage from './ChatMessage';
import SearchUserMessage from '../../components/SearchUser/SearchUserMessage';
import sensitiveWords from '../../Utils/sensitiveWords.js';
import { toast } from 'react-toastify';

const Message = () => {
  const dispatch = useDispatch();
  const { message, auth } = useSelector((store) => store);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState({ url: '', type: '' });
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [latestMessage, setLatestMessage] = useState(null);
  const [chats, setChats] = useState(message.chats);
  const [showCloseIcon, setShowCloseIcon] = useState(false);

  const removeChatCard = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
  };

  const updateLatestMessage = (message) => {
    setLatestMessage(message);
  };

  useEffect(() => {
    dispatch(getAllChats());
  }, [dispatch]);

  useEffect(() => {
    if (message.message && message.message.chatId === currentChat?.id) {
      setMessages((prevMessages) => [...prevMessages, message.message]);
    }
  }, [message.message, currentChat]);

  const handleSelectImage = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const mediaType = file.type.split('/')[0];

    if (mediaType === 'image' || mediaType === 'video') {
      const mediaUrl = await uploadToCloudinary(file, mediaType);
      setSelectedMedia({ url: mediaUrl, type: mediaType });
      setShowCloseIcon(true);
    } else {
      console.error('Unsupported file type');
    }

    setLoading(false);
  };

  const handleRemoveMedia = () => {
    setSelectedMedia({ url: '', type: '' });
    setShowCloseIcon(false);
  };

  const handleCreateMessage = async () => {
    if (!currentChat) {
      toast.error('Please select a chat before sending a message.');
      return;
    }

    setLoading(true);

    const newMessage = {
      chatId: currentChat.id,
      content: inputValue.trim(),
      image: selectedMedia.url,
      mediaType: selectedMedia.type,
      user_id: auth.user.id,
      timestamp: new Date().toISOString(),
    };

    if (newMessage.content || newMessage.image) {
      if (checkSensitiveWords(newMessage.content)) {
        toast.warning('Tin nhắn chứa nội dung không phù hợp!');
        setLoading(false);
        return;
      }

      dispatch(createMessage({ message: newMessage, sendMessageToServer }));
      setInputValue('');
      setSelectedMedia({ url: '', type: '' });
      setShowEmojiPicker(false);
      setShowCloseIcon(false);
    }

    setLoading(false);
  };

  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const sock = new SockJS('http://localhost:8080/ws');
    const stomp = Stomp.over(sock);
    setStompClient(stomp);

    stomp.connect({}, onConnect, onErr);
  }, []);

  const onConnect = () => {
    console.log('WebSocket connected...');
  };

  const onErr = (error) => {
    console.log('Error:', error);
  };

  useEffect(() => {
    if (stompClient && auth.user && currentChat) {
      console.log('Subscribing to chat...');
      const subscription = stompClient.subscribe(`/user/${currentChat.id}/private`, onMessageReceive);
      return () => subscription.unsubscribe();
    }
  }, [stompClient, auth.user, currentChat]);

  const sendMessageToServer = (newMessage) => {
    if (stompClient && newMessage) {
      console.log('Sending message to server...');
      stompClient.send(`/app/chat/${currentChat?.id.toString()}`, {}, JSON.stringify(newMessage));
    }
  };

  const onMessageReceive = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    console.log('Message received from WebSocket:', receivedMessage);
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEmojiClick = (emoji) => {
    const emojiString = emoji.emoji;
    setInputValue((prevInputValue) => prevInputValue + emojiString);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const checkSensitiveWords = (content) => {
    for (let word of sensitiveWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(content)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      <Grid container className='h-screen overflow-hidden'>
        <Grid className='px-5' item xs={3}>
          <div className='flex h-full justify-between space-x-2'>
            <div className='w-full'>
              <Link to="/" className='flex space-x-4 items-center py-5' style={{ color: '#3698d2' }}>
                <WestIcon />
                <h1 className='text-xl font-bold'>Trang chủ</h1>
              </Link>
              <div className='h-[83vh]'>
                <div>
                  <SearchUserMessage setCurrentChat={setCurrentChat} setMessages={setMessages} />
                </div>
                <div className='h-full space-y-4 mt-5 overflow-y-scroll hideScrollbar'>
                  {message.chats.map((item) => (
                    <div key={item.id} onClick={() => {
                      setCurrentChat(item);
                      setCurrentChat(item);
                      setMessages(item.messages);
                    }}>
                      <UserChatCard chat={item} latestMessage={latestMessage} updateLatestMessage={updateLatestMessage} removeChatCard={removeChatCard} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid className='h-full' item xs={9}>
          {currentChat ? (
            <div>
              <div className='flex justify-between items-center border-l p-5'>
                <div className='flex items-center space-x-3 gap-3'>
                  <Avatar
                    sx={{
                      bgcolor: '#191c29',
                      color: 'rgb(88,199,250)',
                      fontSize: '2rem'
                    }}
                    src={auth.user?.id === currentChat.users[0]?.id ? currentChat.users[1].avatar : currentChat.users[0].avatar}
                  />
                  <p className='left-5'>{auth.user?.id === currentChat.users[0]?.id ? `${currentChat.users[1].firstName} ${currentChat.users[1].lastName}` : `${currentChat.users[0].firstName} ${currentChat.users[0].lastName}`}</p>
                </div>
                <div className='flex space-x-3'>
                  <IconButton>
                    <AddIcCallIcon />
                  </IconButton>
                  <IconButton>
                    <VideoCallIcon />
                  </IconButton>
                </div>
              </div>
              <div ref={chatContainerRef} className='hideScrollbar overflow-y-scroll h-[82vh] px-2 space-y-5 py-5'>
                {messages.map((item, index) => <ChatMessage key={index} item={item} />)}
                <div className='absolute bottom-[10%] right-[0%]'>
                  {showEmojiPicker && (
                    <div>
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>
              </div>
              <div className='sticky bottom-0 border-l'>
                {selectedMedia.url && (
                  <div className='relative'>
                    <IconButton className="absolute -top-2 -right-2" onClick={handleRemoveMedia}>
                      <CloseIcon />
                    </IconButton>
                    {selectedMedia.type === 'image' ? (
                      <img className='w-[7rem] h-[7rem] object-cover px-2' src={selectedMedia.url} alt='' />
                    ) : (
                      <video className='w-[7rem] h-[7rem] object-cover px-2' controls>
                        <source src={selectedMedia.url} type='video/mp4' />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
                <div className='py-5 flex items-center justify-start space-x-5'>
                  <div>
                    <input type='file' accept='image/*, video/*' onChange={handleSelectImage} className='hidden' id='image-input' />
                    <label htmlFor='image-input'>
                      <AddPhotoAlternateIcon style={{ color: 'green' }} />
                    </label>
                  </div>
                  <TextareaAutosize
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (inputValue.trim() || selectedMedia.url) {
                          handleCreateMessage();
                        }
                      }
                    }}
                    className='bg-transparent border border-[#3b40544] rounded-full w-[80%] py-3 px-5'
                    placeholder='Nhập tin nhắn...'
                    type='text'
                  />

                  <div>
                    <IconButton onClick={toggleEmojiPicker}>
                      <InsertEmoticonIcon style={{ color: "yellow" }} />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='h-full space-y-5 flex flex-col justify-center items-center' style={{ color: '#3698d2' }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: '13rem' }} />
              <p className='text-xl font-semibold'>Chưa chọn người nhắn tin</p>
            </div>
          )}
        </Grid>
      </Grid>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </div>
  );
};

export default Message;