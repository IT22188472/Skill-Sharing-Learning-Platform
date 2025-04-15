package com.flavourflow.backend.repository;

import java.util.List;


import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.data.mongodb.repository.Query;

import com.flavourflow.backend.models.Post;


public interface PostRepository extends MongoRepository<Post,String>{

    //@Query("Select p from Post p where p.user.id=:userId")
    List<Post> findPostByUserId(String userId);



}
