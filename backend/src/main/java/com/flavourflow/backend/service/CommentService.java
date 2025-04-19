package com.flavourflow.backend.service;

import com.flavourflow.backend.models.Comment;

public interface CommentService {

    public Comment createComment(Comment comment, String postId, String userId) throws Exception;

    public Comment findCommentById(String commentId) throws Exception;

    public Comment likeComment(String commentId, String userId) throws Exception;

}
