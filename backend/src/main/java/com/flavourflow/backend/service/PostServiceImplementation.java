package com.flavourflow.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
    public Post createNewPost(Post post, Integer userId) throws Exception {

        User user=userService.findUserById(userId);

        Post newPost=new Post();
        newPost.setTitle(post.getTitle());
        newPost.setIngredients(post.getIngredients());
        newPost.setInstructions(post.getInstructions());
        newPost.setImageUrl(post.getImageUrl());
        newPost.setVideoUrl(post.getVideoUrl());
        newPost.setCreatedAt(LocalDateTime.now());
        newPost.setUser(user);

        return postRepository.save(newPost);
    }

    @Override
    public String deletePost(String postId, Integer userId) throws Exception {
        Post post=findPostById(postId);
        User user=userService.findUserById(userId);

        if (post.getUser().getId()!=user.getId()) {
            throw new Exception("You can't delete another users post");
        }

        postRepository.delete(post);
        return "post deleted succesfully";
   
    }

    @Override
    public List<Post> findPostByUserId(Integer userId) {

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
    public Post savedPost(String postId, Integer userId) throws Exception {
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
    public Post likePost(String postId, Integer userId) throws Exception {
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

}
