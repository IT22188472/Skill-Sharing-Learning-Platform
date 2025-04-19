package com.flavourflow.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.flavourflow.backend.models.Comment;

public interface CommentRepository extends MongoRepository<Comment,String>{

}
