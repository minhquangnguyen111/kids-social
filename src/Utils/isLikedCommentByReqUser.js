export const isCommentLikedByRegUser = (reqUserId, comment) => {
   // Kiểm tra xem comment có thuộc tính liked hay không, nếu không trả về false
   if (!comment?.commentLiked || comment.commentLiked?.length === 0) {
      return false;
   }

   // Lặp qua mảng liked để kiểm tra xem người dùng có trong danh sách đã thích không
   for (let likedUser of comment?.commentLiked) {
      if (reqUserId === likedUser.id) {
         return true;
      }
   }
   return false;
}