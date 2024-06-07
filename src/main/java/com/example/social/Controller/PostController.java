package com.example.social.Controller;

import com.example.social.Entity.Post;
import com.example.social.Entity.User;
import com.example.social.Response.ApiResponse;
import com.example.social.Service.PostService;
import com.example.social.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@RestController
public class PostController {

    @Autowired
    PostService postService;

    @Autowired
    UserService userService;

    @PostMapping("/api/posts")
    public ResponseEntity<Post> createPost(@RequestHeader("Authorization") String jwt,
                                           @RequestBody Post post) throws Exception {

        User reqUser = userService.findUserByJwt(jwt);
        Post createdPost = postService.createNewPost(post, reqUser.getId());

        return new ResponseEntity<>(createdPost, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/api/posts/{postId}")
    public ResponseEntity<ApiResponse> deletePost(@RequestHeader("Authorization") String jwt,
                                                  @PathVariable Integer postId) throws Exception {

        User reqUser = userService.findUserByJwt(jwt);
        String message = postService.deletePost(postId, reqUser.getId());
        ApiResponse res = new ApiResponse(message, true);
        return new ResponseEntity<ApiResponse>(res, HttpStatus.OK);
    }

    @GetMapping("/api/posts/{postId}")
    public ResponseEntity<Post> findPostByIdHandle(@PathVariable Integer postId) throws Exception {

        Post post = postService.findPostById(postId);

        return new ResponseEntity<Post>(post, HttpStatus.ACCEPTED);
    }

    @GetMapping("/api/posts/user/{userId}")
    public ResponseEntity<List<Post>> findUsersPost(@PathVariable Integer userId) {

        List<Post> posts = postService.findPostByUserId(userId);
        posts.sort(Comparator.comparing(Post::getCreateAt).reversed());
        return new ResponseEntity<List<Post>>(posts, HttpStatus.OK);
    }

    @GetMapping("/api/posts")
    public ResponseEntity<List<Post>> findAllPost(@RequestHeader("Authorization") String jwt) throws Exception {
        User reqUser = userService.findUserByJwt(jwt);
        List<Post> posts = postService.findAllPost(reqUser.getId());
        posts.sort(Comparator.comparing(Post::getCreateAt).reversed());
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @PutMapping("/api/posts/save/{postId}")
    public ResponseEntity<Post> savedPostHandler(@RequestHeader("Authorization") String jwt,
                                                 @PathVariable Integer postId) throws Exception {

        User reqUser = userService.findUserByJwt(jwt);
        Post post = postService.savedPost(postId, reqUser.getId());

        return new ResponseEntity<Post>(post, HttpStatus.ACCEPTED);
    }

    @PutMapping("/api/posts/like/{postId}")
    public ResponseEntity<Post> likePostHandler(@PathVariable Integer postId,
                                                @RequestHeader("Authorization") String jwt) throws Exception {

        User reqUser = userService.findUserByJwt(jwt);
        Post post = postService.likePost(postId, reqUser.getId());

        return new ResponseEntity<Post>(post, HttpStatus.ACCEPTED);
    }

    @GetMapping("/api/posts/saved")
    public ResponseEntity<List<Post>> findSavedPosts(@RequestHeader("Authorization") String jwt) {
        try {
            // Tìm kiếm người dùng dựa trên JWT
            User user = userService.findUserByJwt(jwt);

            // Lấy danh sách các bài đăng đã lưu của người dùng
            List<Post> savedPosts = user.getSavedPost();

            // Đảo ngược danh sách bài đăng
            Collections.reverse(savedPosts);
            // Trả về danh sách các bài đăng đã lưu
            return new ResponseEntity<>(savedPosts, HttpStatus.OK);
        } catch (Exception e) {
            // Xử lý ngoại lệ nếu có
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/api/posts/{postId}/save")
    public ResponseEntity<Post> savePost(@RequestHeader("Authorization") String jwt, @PathVariable Integer postId) {
        try {
            // Tìm kiếm người dùng dựa trên JWT
            User user = userService.findUserByJwt(jwt);

            // Lấy bài đăng dựa trên postId
            Post post = postService.findPostById(postId);

            // Kiểm tra xem bài đăng đã được lưu bởi người dùng hay chưa
            boolean isSaved = user.getSavedPost().contains(post);

            // Nếu bài đăng đã được lưu, hãy bỏ lưu nó
            if (isSaved) {
                user.getSavedPost().remove(post);
            } else { // Nếu bài đăng chưa được lưu, hãy lưu nó
                user.getSavedPost().add(post);
            }

            // Cập nhật trạng thái lưu bài đăng
            isSaved = !isSaved;

            // Lưu thay đổi vào cơ sở dữ liệu
            userService.save(user);

            // Trả về kết quả với trạng thái lưu bài đăng đã được cập nhật
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (Exception e) {
            // Xử lý ngoại lệ nếu có
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
