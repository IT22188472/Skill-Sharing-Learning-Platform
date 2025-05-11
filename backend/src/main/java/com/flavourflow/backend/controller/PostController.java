package com.flavourflow.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.flavourflow.backend.models.Post;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.response.ApiResponse;
import com.flavourflow.backend.service.PostService;
import com.flavourflow.backend.service.UserService;
import com.flavourflow.backend.service.FileStorageService;
import com.flavourflow.backend.repository.PostRepository;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
public class PostController {

    @Autowired
    PostService postService;

    @Autowired
    UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/api/posts")
    public ResponseEntity<?> createPost(@RequestHeader("Authorization")String jwt, @ModelAttribute Post post) {
        try {
            System.out.println("Received post creation request with JWT: " + jwt);
            System.out.println("Post details - Title: " + post.getTitle());
            
            // Check if files are attached
            System.out.println("Image file present: " + (post.getImageFile() != null && !post.getImageFile().isEmpty()));
            System.out.println("Video file present: " + (post.getVideoFile() != null && !post.getVideoFile().isEmpty()));
            
            User reqUser = userService.findUserByJwt(jwt);
            if (reqUser == null) {
                System.err.println("User not found for the provided JWT token");
                return new ResponseEntity<>(new ApiResponse("User not found", false), 
                    HttpStatus.UNAUTHORIZED);
            }
            
            System.out.println("Creating post for user: " + reqUser.getFirstName() + " (ID: " + reqUser.getId() + ")");
            
            // Handle null fields gracefully
            if (post.getTitle() == null) post.setTitle("");
            if (post.getIngredients() == null) post.setIngredients("");
            if (post.getInstructions() == null) post.setInstructions("");

            if (post.getImageFile() != null && !post.getImageFile().isEmpty()) {
                try {
                    if (post.getImageFile().getSize() > 10485760) { // 10MB limit
                        return new ResponseEntity<>(new ApiResponse("Image file too large. Max size: 10MB", false), 
                            HttpStatus.BAD_REQUEST);
                    }
                    String imageUrl = fileStorageService.saveImage(post.getImageFile());
                    post.setImageUrl(imageUrl);
                } catch (Exception e) {
                    System.err.println("Error saving image: " + e.getMessage());
                    // Continue without image if upload fails
                    post.setImageUrl(null);
                }
            }
            
            if (post.getVideoFile() != null && !post.getVideoFile().isEmpty()) {
                try {
                    if (post.getVideoFile().getSize() > 52428800) { // 50MB limit
                        return new ResponseEntity<>(new ApiResponse("Video file too large. Max size: 50MB", false), 
                            HttpStatus.BAD_REQUEST);
                    }
                    String videoUrl = fileStorageService.saveVideo(post.getVideoFile());
                    post.setVideoUrl(videoUrl);
                } catch (Exception e) {
                    System.err.println("Error saving video: " + e.getMessage());
                    // Continue without video if upload fails
                    post.setVideoUrl(null);
                }
            }

            Post createdPost = postService.createNewPost(post, reqUser.getId());
            System.out.println("Post created successfully with ID: " + createdPost.getId());
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            System.err.println("Error in createPost: " + e.getMessage());
            return new ResponseEntity<>(new ApiResponse("Error creating post: " + e.getMessage(), false), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/api/posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId, @RequestHeader("Authorization") String jwt) {
        try {
            User reqUser = userService.findUserByJwt(jwt);
            Post post = postService.findPostById(postId);
            
            if (post == null) {
                return new ResponseEntity<>(new ApiResponse("Post not found", false), 
                    HttpStatus.NOT_FOUND);
            }
            
            if (!post.getUser().getId().equals(reqUser.getId())) {
                return new ResponseEntity<>(new ApiResponse("You are not authorized to delete this post", false),
                    HttpStatus.FORBIDDEN);
            }
            
            postService.deletePost(postId, reqUser.getId());
            return new ResponseEntity<>(new ApiResponse("Post deleted successfully", true), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("Error deleting post: " + e.getMessage(), false),
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/api/posts/{postId}")
    public ResponseEntity<Post> findPostByIdHandler(@PathVariable String postId) throws Exception {
        Post post = postService.findPostById(postId);
        if (post == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @GetMapping("/api/posts/user/{userId}")
    public ResponseEntity<List<Post>> findUserPost(@PathVariable String userId) {
        List<Post> posts = postService.findPostByUserId(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/api/posts")
    public ResponseEntity<List<Post>> findAllPost() {
        List<Post> posts = postService.findAllPost();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }


    @PutMapping("/api/posts/save/{postId}")
    public ResponseEntity<Post> savedPostHandler(@PathVariable String postId, @RequestHeader("Authorization") String jwt) throws Exception {
        User reqUser = userService.findUserByJwt(jwt);
        Post post = postService.savedPost(postId, reqUser.getId());
        return new ResponseEntity<>(post, HttpStatus.OK);
    }


    @PutMapping("/api/posts/like/{postId}")
    public ResponseEntity<Post> likePostHandler(@PathVariable String postId, @RequestHeader("Authorization") String jwt) throws Exception {
        User reqUser = userService.findUserByJwt(jwt);
        Post post = postService.likePost(postId, reqUser.getId());
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @PutMapping("/api/posts/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable String postId, @ModelAttribute Post updatedPost,
            @RequestHeader("Authorization") String jwt) {
        try {
            User reqUser = userService.findUserByJwt(jwt);
            
            // Handle image update
            if (updatedPost.getImageFile() != null && !updatedPost.getImageFile().isEmpty()) {
                if (updatedPost.getImageFile().getSize() > 10485760) {
                    return new ResponseEntity<>(new ApiResponse("Image file too large. Max size: 10MB", false), 
                        HttpStatus.BAD_REQUEST);
                }
                String imageUrl = fileStorageService.saveImage(updatedPost.getImageFile());
                updatedPost.setImageUrl(imageUrl);
            }
            
            // Handle video update
            if (updatedPost.getVideoFile() != null && !updatedPost.getVideoFile().isEmpty()) {
                if (updatedPost.getVideoFile().getSize() > 52428800) {
                    return new ResponseEntity<>(new ApiResponse("Video file too large. Max size: 50MB", false), 
                        HttpStatus.BAD_REQUEST);
                }
                String videoUrl = fileStorageService.saveVideo(updatedPost.getVideoFile());
                updatedPost.setVideoUrl(videoUrl);
            }
            
            Post updatedPostResult = postService.updatePost(postId, updatedPost, reqUser.getId());
            return new ResponseEntity<>(updatedPostResult, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("Error updating post: " + e.getMessage(), false),
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
