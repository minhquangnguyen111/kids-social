export const isSavedByRegUser = (reqUserId, post) => {
   // Kiểm tra xem bài đăng có thuộc tính liked hay không, nếu không trả về false
   // console.log("Check post.save", post)
   if (!post.saved) {
      return false;
   }

   // Lặp qua mảng liked để kiểm tra xem người dùng có trong danh sách đã thích không
   for (let likedUser of post.saved) {
      if (reqUserId === likedUser.id) {
         return true;
      }
   }
   // return false;
}
