package com.flavourflow.backend.service;

import java.util.List;

import com.flavourflow.backend.models.Post;

public interface PostService {

    Post createNewPost(Post post,String userId) throws Exception;

    String deletePost(String postId,String userId) throws Exception;

    List<Post> findPostByUserId(String userId);

    Post findPostById(String postId) throws Exception;

    List<Post> findAllPost();

    Post savedPost(String postId,String userId) throws Exception;

    Post likePost(String postId,String userId) throws Exception;

}
