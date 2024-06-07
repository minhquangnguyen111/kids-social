import React from 'react';
import { useHistory, useNavigate } from 'react-router-dom'; // Đảm bảo bạn đã cài đặt react-router-dom

const GameItem = ({ name, imageSrc }) => {
   const navigate = useNavigate();

   const handleClick = () => {
      // Chuyển đến component <GameState/> khi nhấn vào ảnh hoặc tên trò chơi
      navigate('/snake-game');
   };

   return (
      <div className='py-5' style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleClick}>
         <img src='/game.png' alt={name} style={{ width: '300px', height: '200px', objectFit: 'cover' }} />
         <span>Trò chơi Rắn săn mồi</span>
      </div>
   );
};

export default GameItem;
