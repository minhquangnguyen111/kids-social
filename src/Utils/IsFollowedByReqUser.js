export const isFollowedByRegUser = (reqUserId, user) => {
   // Kiểm tra xem bài đăng có thuộc tính liked hay không, nếu không trả về false
   if (!user.followers || user.followers.length === 0) {
      return false;
   }

   // Lặp qua mảng liked để kiểm tra xem người dùng có trong danh sách đã thích không
   for (let followedUser of user.followers) {
      // console.log("reqUserId", reqUserId)
      // console.log("followedUser", followedUser)
      if (reqUserId === followedUser) {
         return true;
      }
   }
   return false;
}