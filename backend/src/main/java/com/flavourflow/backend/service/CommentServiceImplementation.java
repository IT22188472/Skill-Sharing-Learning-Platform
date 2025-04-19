package com.flavourflow.backend.service;

import java.time.LocalDateTime;
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
            throw new Exception("comment not exist");
        }
        return opt.get();
    }

    @Override
    public Comment likeComment(String commentId, String userId) throws Exception {
        Comment comment = findCommentById(commentId);

        User user = userService.findUserById(userId);

        if (!comment.getLiked().contains(user)) {
            comment.getLiked().add(user);
        }
        else comment.getLiked().remove(user);

        return commentRepository.save(comment);
    }

}
