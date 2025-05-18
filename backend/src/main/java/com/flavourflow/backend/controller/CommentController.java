package com.flavourflow.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.flavourflow.backend.models.Comment;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.request.UpdateCommentRequest;
import com.flavourflow.backend.service.CommentService;
import com.flavourflow.backend.service.UserService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
public class CommentController {
       
    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @PostMapping("/api/comments/post/{postId}")
      public Comment createComment(@RequestBody Comment comment,
                                 @RequestHeader("Authorization") String jwt,
                                 @PathVariable("postId") String postId) throws Exception {
                                    
        User user = userService.findUserByJwt(jwt);

        return commentService.createComment(comment, postId, user.getId());
    }

   @PutMapping("/api/comments/{commentId}")
   public Comment updateComment(@PathVariable String commentId,
                             @RequestHeader("Authorization") String jwt,
                             @RequestBody UpdateCommentRequest request) throws Exception {
    User user = userService.findUserByJwt(jwt);
    return commentService.updateComment(commentId, user.getId(), request.getContent());
}


    @DeleteMapping("/api/comments/{commentId}")
    public void deleteComment(@PathVariable String commentId,
                              @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwt(jwt);

        commentService.deleteComment(commentId, user.getId());
    }

    @PutMapping("/api/comments/like/{commentId}")
    public Comment likeComment(@RequestHeader("Authorization") String jwt,
                               @PathVariable("commentId") String commentId) throws Exception {

        User user = userService.findUserByJwt(jwt);

        return commentService.likeComment(commentId, user.getId());
    }

    @PostMapping("/api/comments/reply/{parentCommentId}")
    public Comment replyToComment(@PathVariable String parentCommentId,
                                  @RequestBody Comment reply,
                                  @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwt(jwt);

        return commentService.replyToComment(parentCommentId, reply, user.getId());
    }

    @GetMapping("/api/comments/replies/{parentCommentId}")
    public List<Comment> getReplies(@PathVariable String parentCommentId) {

        return commentService.getReplies(parentCommentId);
    }
}
