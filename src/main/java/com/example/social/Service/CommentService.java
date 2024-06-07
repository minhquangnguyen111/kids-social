package com.example.social.Service;


import com.example.social.Entity.Comment;

import java.util.List;

public interface CommentService {

    public Comment createComment(Comment comment, Integer postId, Integer UserId)
            throws Exception;

    public Comment findCommentById(Integer commentId) throws Exception;

    public Comment likeComment(Integer commentId, Integer userId) throws Exception;

    public List<Comment> getAllComments();


}
