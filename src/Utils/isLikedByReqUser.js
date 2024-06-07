export const isLikedByRegUser = (reqUserId, post) => {
    // Kiểm tra xem bài đăng có thuộc tính liked hay không, nếu không trả về false
    if (!post.liked || post.liked.length === 0) {
        return false;
    }

    // Lặp qua mảng liked để kiểm tra xem người dùng có trong danh sách đã thích không
    for (let likedUser of post.liked) {
        if (reqUserId === likedUser.id) {
            return true;
        }
    }
    return false;
}
