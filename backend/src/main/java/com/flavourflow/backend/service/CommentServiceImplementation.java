package com.flavourflow.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flavourflow.backend.models.Comment;
import com.flavourflow.backend.models.Post;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.CommentRepository;
import com.flavourflow.backend.repository.PostRepository;

@Service
public class CommentServiceImplementation implements CommentService {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Override
    public Comment createComment(Comment comment, String postId, String userId) throws Exception {
        User user = userService.findUserById(userId);
        Post post = postService.findPostById(postId);

        comment.setUser(user);
        comment.setPost(post); 
        comment.setContent(comment.getContent());
        comment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);

        post.getComments().add(savedComment);
        postRepository.save(post);

        return savedComment;
    }

    @Override
    public Comment findCommentById(String commentId) throws Exception {
        Optional<Comment> opt = commentRepository.findById(commentId);

        if (opt.isEmpty()) {
            throw new Exception("Comment does not exist");
        }
        return opt.get();
    }

    @Override
    public Comment likeComment(String commentId, String userId) throws Exception {
      Comment comment = findCommentById(commentId);
    User user = userService.findUserById(userId);

    //  Check if user already liked the comment
    boolean isLiked = comment.getLiked().stream()
        .anyMatch(likedUser -> likedUser.getId().equals(userId)); // 🔄 updated check using userId

    if (isLiked) {
        // Remove like if already liked
        comment.getLiked().removeIf(likedUser -> likedUser.getId().equals(userId)); // 🔄 safer remove
    } else {
        //  Add like if not already liked
        comment.getLiked().add(user); //  only add if not liked
    }

    return commentRepository.save(comment); // persist the change
    }

    @Override
     public Comment updateComment(String commentId, String userId, String newContent) throws Exception {
        Comment comment = findCommentById(commentId);
        if (!comment.getUser().getId().equals(userId)) {
            throw new Exception("You can only update your own comments");
        }
        comment.setContent(newContent);
        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(String commentId, String userId) throws Exception {
      Comment comment = findCommentById(commentId);

    if (comment.getPost() == null) {
        throw new Exception("Comment is not associated with a post");
    }

    Post post = postService.findPostById(comment.getPost().getId());

    if (!comment.getUser().getId().equals(userId) && !post.getUser().getId().equals(userId)) {
        throw new Exception("Only the comment owner or post owner can delete this comment");
    }

    commentRepository.delete(comment);
    }

    @Override
    public Comment replyToComment(String parentCommentId, Comment reply, String userId) throws Exception {
        Comment parentComment = findCommentById(parentCommentId);
        User user = userService.findUserById(userId);

        reply.setUser(user);
        reply.setCreatedAt(LocalDateTime.now());
        reply.setParentComment(parentComment);

        return commentRepository.save(reply);
    }

    @Override
    public List<Comment> getReplies(String parentCommentId) {
        return commentRepository.findByParentCommentId(parentCommentId);
    }

}
