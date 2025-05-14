package com.flavourflow.backend.service;

import java.util.List;

import com.flavourflow.backend.models.Comment;

public interface CommentService {

    public Comment createComment(Comment comment, String postId, String userId) throws Exception;

    public Comment findCommentById(String commentId) throws Exception;

    public Comment likeComment(String commentId, String userId) throws Exception;

    public Comment updateComment(String commentId, String userId, String newContent) throws Exception;

    public void deleteComment(String commentId, String userId) throws Exception;

    public Comment replyToComment(String parentCommentId, Comment reply, String userId) throws Exception;

    public List<Comment> getReplies(String parentCommentId);

}
