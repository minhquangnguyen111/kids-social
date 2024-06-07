package com.example.social.Service;

import com.example.social.Entity.Post;

import java.util.List;

public interface PostService {
    Post createNewPost(Post post, Integer userId) throws Exception;

    String deletePost(Integer postId, Integer userId) throws Exception;


    List<Post> findPostByUserId(Integer userId);

    Post findPostById(Integer postId) throws Exception;

    List<Post> findAllPost(Integer userId) throws Exception;

    Post savedPost(Integer postId, Integer userId) throws Exception;

    Post likePost(Integer postId, Integer userId) throws Exception;


}
