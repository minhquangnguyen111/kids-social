import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Card, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteReel } from '../../Redux/Auth/auth.action';
import { getUserReelsAction } from '../../Redux/Reels/reels.action';
import { toast } from 'react-toastify';

const UserReelsCard = ({ reel }) => {
   const { auth } = useSelector(store => store);
   const dispatch = useDispatch();
   const jwt = useSelector(state => state.auth.jwt); // Đảm bảo đường dẫn đúng
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [selectedReel, setSelectedReel] = useState(null);
   const [deleteSuccess, setDeleteSuccess] = useState(false); // State để kiểm tra xóa thành công

   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);

   const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
   };

   const handleDelete = (reel) => {
      setSelectedReel(reel);
      setDeleteDialogOpen(true);
   };

   const handleConfirmDelete = () => {
      dispatch(deleteReel(selectedReel.id, jwt))
         .then(() => {
            setDeleteSuccess(true); // Xóa thành công
            setDeleteDialogOpen(false); // Đóng dialog
            dispatch(getUserReelsAction(auth.user?.id));
            toast.success("Deleted successfully");
            setAnchorEl(null)
         })
         .catch(error => {
            console.error("Error deleting reel:", error);
            setDeleteSuccess(false); // Xóa không thành công
         });
   };

   return (
      <div className='flex flex-col w-[30rem] h-auto px-10 mt-5'>
         <Card className="relative">
            <video
               controls
               className='w-full h-full rounded-xl'
               src={reel.video}
            />
            <div className='absolute bottom-32 start-3'>
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
                     >
                        {reel.user.lastName}
                     </Avatar>
                  }
                  title={
                     <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                        {reel.user.firstName + " " + reel.user.lastName}
                     </p>
                  }
                  subheader={
                     <p style={{ color: 'gray' }}>
                        {reel.user.firstName.toLowerCase() + "_" + reel.user.lastName.toLowerCase()}
                     </p>
                  }
               />
            </div>
            <div className="absolute bottom-0 left-0 text-white px-2 py-1 bottom-24 start-3">
               <p style={{ fontSize: '1.2rem' }}>{reel.title}</p>
            </div>
         </Card>
         <div className='absolute right-96'>
            <IconButton onClick={handleMenuOpen}>
               <MoreVertIcon />
            </IconButton>
            <Menu
               anchorEl={anchorEl}
               open={open}
               onClose={handleMenuClose}
               PaperProps={{
                  style: {
                     maxHeight: 48 * 4.5,
                     width: '20ch',
                  },
               }}
            >
               <MenuItem style={{ color: 'red' }} onClick={() => handleDelete(reel)} >
                  <DeleteIcon /> Xóa thước phim
               </MenuItem>
            </Menu>
            <Dialog
               open={deleteDialogOpen}
               onClose={() => setDeleteDialogOpen(false)}
            >
               <DialogContent>
                  <DialogContentText>
                     Bạn có muốn xóa thước phim này không ?
                  </DialogContentText>
               </DialogContent>
               <DialogActions>
                  <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                  <Button onClick={handleConfirmDelete}>Xóa</Button>
               </DialogActions>
            </Dialog>

         </div>
      </div>
   );
};

export default UserReelsCard;
