package com.flavourflow.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flavourflow.backend.models.Post;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.PostRepository;
import com.flavourflow.backend.repository.UserRepository;

@Service
public class PostServiceImplementation implements PostService {

    @Autowired
    PostRepository postRepository;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Override
    public Post createNewPost(Post post, String userId) throws Exception {
        try {
            User user = userService.findUserById(userId);
            if (user == null) {
                throw new Exception("User not found with ID: " + userId);
            }

            Post newPost = new Post();
            newPost.setTitle(post.getTitle());
            newPost.setIngredients(post.getIngredients());
            newPost.setInstructions(post.getInstructions());
            newPost.setImageUrl(post.getImageUrl());
            newPost.setVideoUrl(post.getVideoUrl());
            newPost.setCreatedAt(LocalDateTime.now());
            newPost.setUser(user);
            newPost.setLiked(new ArrayList<>());

            return postRepository.save(newPost);
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Error creating post: " + e.getMessage());
        }
    }

    
    @Override
    public String deletePost(String postId, String userId) throws Exception {
        Post post=findPostById(postId);
        User user=userService.findUserById(userId);

        if (!post.getUser().getId().equals(user.getId())) {
            throw new Exception("You can't delete another users post");
        }

        postRepository.delete(post);
        return "post deleted succesfully";
   
    }

    @Override
    public List<Post> findPostByUserId(String userId) {

        return postRepository.findPostByUserId(userId);
    }

    @Override
    public Post findPostById(String postId) throws Exception {
       Optional<Post> post=postRepository.findById(postId);

       if(post.isEmpty()){
        throw new Exception("Post not found with id: "+postId);
       }
       return post.get();
    }

    @Override
    public List<Post> findAllPost() {

        return postRepository.findAll();
    }

    @Override
    public Post savedPost(String postId, String userId) throws Exception {
        Post post=findPostById(postId);
        User user=userService.findUserById(userId);

        if (user.getSavedPost().contains(post)) {
            user.getSavedPost().remove(post);
        }
        else{

            user.getSavedPost().add(post);
        }

        userRepository.save(user);

        return post;
    }

    @Override
    public Post likePost(String postId, String userId) throws Exception {
        Post post=findPostById(postId);
        User user=userService.findUserById(userId);

        if (post.getLiked().contains(user)) {
            post.getLiked().remove(user);
        }
        else{
           post.getLiked().add(user);
        }

        
        return postRepository.save(post);
    }

    @Override
    public Post updatePost(String postId, Post updatedPost, String userId) throws Exception {
        try {
            Post existingPost = findPostById(postId);
            User user = userService.findUserById(userId);

            if (!existingPost.getUser().getId().equals(userId)) {
                throw new Exception("You can't update another user's post");
            }

            // Update only the fields that are provided
            if (updatedPost.getTitle() != null) existingPost.setTitle(updatedPost.getTitle());
            if (updatedPost.getIngredients() != null) existingPost.setIngredients(updatedPost.getIngredients());
            if (updatedPost.getInstructions() != null) existingPost.setInstructions(updatedPost.getInstructions());
            if (updatedPost.getImageUrl() != null) existingPost.setImageUrl(updatedPost.getImageUrl());
            if (updatedPost.getVideoUrl() != null) existingPost.setVideoUrl(updatedPost.getVideoUrl());

            // Keep the original creation date and liked list
            // DO NOT modify these fields
            // existingPost.setCreatedAt(existingPost.getCreatedAt());
            // existingPost.setLiked(existingPost.getLiked());
            
            System.out.println("Updating post with ID: " + existingPost.getId());
            return postRepository.save(existingPost);
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Error updating post: " + e.getMessage());
        }
    }

}
