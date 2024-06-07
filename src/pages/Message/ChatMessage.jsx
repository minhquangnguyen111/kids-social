import React from 'react';
import { useSelector } from 'react-redux';
import { formatCreatedAt } from '../../components/Post/formatCreateAt';

const ChatMessage = ({ item, updateLatestMessage }) => {
    const { auth } = useSelector(store => store);

    // Hàm tạo một gradient màu ngẫu nhiên từ ba màu đã cho
    const getRandomGradient = () => {
        const colors = ['#8CBDFE', '#4DA1FF', '#A16DFF'];
        const randomColors = colors.sort(() => Math.random() - 0.5);
        return `linear-gradient(135deg, ${randomColors[0]} 20%, ${randomColors[1]} 40%, ${randomColors[2]} 100%)`;
    };

    const backgroundStyle = {
        background: getRandomGradient(), // Gradient màu ngẫu nhiên
        padding: '0.4rem', // Padding cho tin nhắn
        borderRadius: '1.7rem', // Bo tròn các góc
        maxWidth: '80%', // Giới hạn chiều rộng tối đa
    };

    const formattedTime = formatCreatedAt(item.timestamp);

    // Hàm xác định loại tệp từ URL
    const getMediaType = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        if (['mp4', 'webm', 'ogg'].includes(extension)) {
            return 'video';
        }
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return 'image';
        }
        return null;
    };

    const mediaType = getMediaType(item.image);

    // Gọi hàm updateLatestMessage khi có tin nhắn mới
    React.useEffect(() => {
        if (updateLatestMessage) {
            updateLatestMessage(item);
        }
    }, [item, updateLatestMessage]);

    return (
        <div className={`flex flex-col ${auth.user.id !== item.user.id ? "items-start" : "items-end"} text-white break-words whitespace-pre-line`}>
            {mediaType === 'image' && (
                <img className='w-[20rem] h-auto object-cover rounded-md mb-2' alt='' src={item.image} />
            )}
            {mediaType === 'video' && (
                <video className='w-[20rem] h-auto object-cover rounded-md mb-2' controls>
                    <source src={item.image} type='video/mp4' />
                    Your browser does not support the video tag.
                </video>
            )}
            {item.content && (
                <div className={`text-lg ${item.image ? "rounded-md" : "rounded-full"} mb-1`} style={{ ...backgroundStyle }}>
                    <p className="py-1 bg-transparent outline-none border-none resize-none ml-2 mr-2">
                        {item.content}
                    </p>
                </div>
            )}
            <div className='text-secondary mr-2 ml-2'>
                <p className='text-gray-500'>{formattedTime}</p>
            </div>
        </div>
    );
};

export default ChatMessage;