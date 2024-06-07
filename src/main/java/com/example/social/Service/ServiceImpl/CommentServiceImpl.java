package com.example.social.Service.ServiceImpl;

import com.example.social.Entity.Comment;
import com.example.social.Entity.Post;
import com.example.social.Entity.User;
import com.example.social.Repository.CommentRepository;
import com.example.social.Repository.PostRepository;
import com.example.social.Service.CommentService;
import com.example.social.Service.PostService;
import com.example.social.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private PostService postService;
    @Autowired
    private UserService userService;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Override
    public Comment createComment(Comment comment, Integer postId, Integer UserId)
            throws Exception {

        User user = userService.findUserById(UserId);
        Post post = postService.findPostById(postId);

        comment.setUser(user);
        comment.setContent(comment.getContent());
        comment.setCreateAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);

        post.getComments().add(savedComment);

        postRepository.save(post);

        return savedComment;
    }

    @Override
    public Comment findCommentById(Integer commentId)
            throws Exception {

        Optional<Comment> opt = commentRepository.findById(commentId);

        if (opt.isEmpty()) {
            throw new Exception("Comment not exist!");
        }

        return opt.get();
    }

    @Override
    public Comment likeComment(Integer commentId, Integer userId)
            throws Exception {

        Comment comment = findCommentById(commentId);
        User user = userService.findUserById(userId);

        if (!comment.getCommentLiked().contains(user)) {
            comment.getCommentLiked().add(user);
        } else {
            comment.getCommentLiked().remove(user);
        }

        return commentRepository.save(comment);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

}
