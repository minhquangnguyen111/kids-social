import { Box, Button, IconButton, Modal } from "@mui/material";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { toast } from 'react-toastify'; // Import react-toastify để hiển thị cảnh báo
import sensitiveWords from "../../Utils/sensitiveWords";

const AvatarModal = ({ open, handleClose, selectedImage, handleAvatarConfirmation }) => {
   const [caption, setCaption] = useState("");
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

   const checkSensitiveWords = (text) => {
      for (let word of sensitiveWords) {
         const regex = new RegExp(`\\b${word}\\b`, 'gi');
         if (regex.test(text)) {
            return true;
         }
      }
      return false;
   };

   const handleEmojiClick = (emoji) => {
      const emojiString = emoji.emoji;
      setCaption((prevCaption) => prevCaption + emojiString);
   };

   const toggleEmojiPicker = () => {
      setShowEmojiPicker(!showEmojiPicker);
   };

   const handleConfirmation = () => {
      // Kiểm tra xem caption có chứa từ nhạy cảm không
      const containsSensitiveWord = checkSensitiveWords(caption);

      // Nếu caption chứa từ nhạy cảm, hiển thị cảnh báo
      if (containsSensitiveWord) {
         toast.warning('Caption chứa nội dung không phù hợp!');
         return;
      }

      // Tiếp tục xử lý logic khi caption không chứa từ nhạy cảm
      handleAvatarConfirmation(caption);
   };

   return (
      <Modal open={open} onClose={handleClose}>
         <Box sx={{ width: 'auto', height: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', boxShadow: 24, p: 4, borderRadius: '8px' }}>
            <div className="flex-row">
               <img src={selectedImage} alt="Selected Avatar" style={{ width: '50%', height: '50%', maxWidth: '50%', maxHeight: '50%' }} className="rounded-xl" />
               <div className="flex-col">
                  <textarea
                     className='outline-none w-full mt-5 p-2 bg-transparent border border-[#3b4054] rounded-2xl w-full'
                     placeholder='Write caption...'
                     value={caption}
                     onChange={(e) => setCaption(e.target.value)}
                     cols="4"
                     rows="6"
                  />
                  <IconButton onClick={toggleEmojiPicker}>
                     <InsertEmoticonIcon className='text-yellow-400' />
                  </IconButton>
                  <div className="emoji-container">
                     <div className='emoji-picker'>
                        {showEmojiPicker && (
                           <div className="absolute right-[100%] bottom-[20%]">
                              <EmojiPicker onEmojiClick={handleEmojiClick} />
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
            <div className='flex w-full justify-end'>
               <Button onClick={handleConfirmation} variant="contained" color="primary" >Cập nhật</Button>
            </div>
         </Box>
      </Modal>
   );
};

export default AvatarModal;
