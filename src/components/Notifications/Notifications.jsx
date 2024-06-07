import React, { useEffect, useState } from 'react';

const Notifications = () => {
    const [newMessageNotification, setNewMessageNotification] = useState(null);

    useEffect(() => {
        // Lắng nghe thông báo tin nhắn mới từ window
        const handleMessageNotification = (event) => {
            if (event.data && event.data.type === 'new_message') {
                // Cập nhật thông báo tin nhắn mới
                setNewMessageNotification(`New message from ${event.data.senderName}`);
            }
        };

        // Đăng ký sự kiện lắng nghe tin nhắn mới
        window.addEventListener('message', handleMessageNotification);

        // Xóa sự kiện khi component unmount
        return () => {
            window.removeEventListener('message', handleMessageNotification);
        };
    }, []);

    return (
        <div>
            {newMessageNotification && (
                <div className="notification">{newMessageNotification}</div>
            )}
        </div>
    );
};

export default Notifications;