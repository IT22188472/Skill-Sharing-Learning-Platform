package com.flavourflow.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.flavourflow.backend.models.Comment;

public interface CommentRepository extends MongoRepository<Comment,String>{
    public List<Comment> findByParentCommentId(String parentCommentId);
}
