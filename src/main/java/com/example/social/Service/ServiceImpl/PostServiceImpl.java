package com.example.social.Service.ServiceImpl;

import com.example.social.Entity.Post;
import com.example.social.Entity.User;
import com.example.social.Exceptions.UserException;
import com.example.social.Repository.PostRepository;
import com.example.social.Repository.UserRepository;
import com.example.social.Service.PostService;
import com.example.social.Service.UserService;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    PostRepository postRepository;
    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;

    @Override
    public Post createNewPost(Post post, Integer userId) throws Exception {

        User user = userService.findUserById(userId);

        Post newPost = new Post();
        newPost.setCaption(post.getCaption());
        newPost.setImage(post.getImage());
        newPost.setCreateAt(LocalDateTime.now());
        newPost.setVideo(post.getVideo());
        newPost.setUser(user);
        return postRepository.save(newPost);
    }

    @Override
    public String deletePost(Integer postId, Integer userId) throws Exception {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (post.getUser().getId() != user.getId()) {
            throw new Exception("You can't delete anothor users post!");
        }
        postRepository.delete(post);
        return "Post deleted successfully!";
    }

    @Override
    public List<Post> findPostByUserId(Integer userId) {

        return postRepository.findPostByUserId(userId);

    }

    @Override
    public Post findPostById(Integer postId) throws Exception {
        Optional<Post> otp = postRepository.findById(postId);
        if (otp.isEmpty()) {
            throw new Exception("Post not found with id:" + postId);
        }
        return otp.get();
    }

    @Override
    public List<Post> findAllPost(Integer userId) throws Exception {
        User user = userService.findUserById(userId);
        return postRepository.findAll();
    }

    @Override
    public Post savedPost(Integer postId, Integer userId) throws Exception {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (user.getSavedPost().contains(post)) {
            user.getSavedPost().remove(post);
            post.getSaved().remove(user);
        } else {
            user.getSavedPost().add(post);
            post.getSaved().add(user);
        }
        userRepository.save(user);
        return post;
    }

    @Override
    public Post likePost(Integer postId, Integer userId) throws Exception {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (post.getLiked().contains(user)) {
            post.getLiked().remove(user);
        } else {
            post.getLiked().add(user);
        }
        return postRepository.save(post);
    }
}
