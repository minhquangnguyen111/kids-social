package com.example.social.Controller;

import com.example.social.Entity.Comment;
import com.example.social.Entity.Post;
import com.example.social.Entity.User;
import com.example.social.Repository.CommentRepository;
import com.example.social.Service.CommentService;
import com.example.social.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
public class CommentController {

    @Autowired
    private CommentService commentService;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserService userService;

    @PostMapping("/api/comments/post/{postId}")
    public Comment createComment(@RequestBody Comment comment,
                                 @RequestHeader("Authorization") String jwt,
                                 @PathVariable("postId") Integer postId) throws Exception {

        User user = userService.findUserByJwt(jwt);

        Comment createdComment = commentService.createComment(comment, postId, user.getId());

        return createdComment;
    }

    @PutMapping("/api/comments/like/{commentId}")
    public Comment likeComment(@RequestHeader("Authorization") String jwt,
                               @PathVariable Integer commentId) throws Exception {

        User user = userService.findUserByJwt(jwt);

        Comment likedComment = commentService.likeComment(commentId, user.getId());

        return likedComment;
    }

    @GetMapping("/api/comments")
    public List<Comment> getAllComments(@RequestHeader("Authorization") String jwt) {
        List<Comment> comments = commentService.getAllComments();
        comments.sort(Comparator.comparing(Comment::getCreateAt).reversed());
        return comments;
    }


}
