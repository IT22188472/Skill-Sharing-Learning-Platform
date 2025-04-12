package com.flavourflow.backend.service;

import java.util.List;

import com.flavourflow.backend.models.Post;

public interface PostService {

    Post createNewPost(Post post,Integer userId) throws Exception;

    String deletePost(String postId,Integer userId) throws Exception;

    List<Post> findPostByUserId(Integer userId);

    Post findPostById(String postId) throws Exception;

    List<Post> findAllPost();

    Post savedPost(String postId,Integer userId) throws Exception;

    Post likePost(String postId,Integer userId) throws Exception;

}
