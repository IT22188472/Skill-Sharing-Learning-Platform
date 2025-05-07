package com.flavourflow.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.flavourflow.backend.models.Post;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.response.ApiResponse;
import com.flavourflow.backend.service.PostService;
import com.flavourflow.backend.service.UserService;
import com.flavourflow.backend.service.FileStorageService;
import com.flavourflow.backend.repository.PostRepository;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PostRepository postRepository;

    @PostMapping("/api/posts")
    public ResponseEntity<?> createPost(@RequestHeader("Authorization") String jwt, @ModelAttribute Post post) {
        try {
            User reqUser = userService.findUserByJwt(jwt);
            if (reqUser == null) {
                return new ResponseEntity<>(new ApiResponse("User not found", false), HttpStatus.UNAUTHORIZED);
            }

            if (post.getTitle() == null) post.setTitle("");
            if (post.getIngredients() == null) post.setIngredients("");
            if (post.getInstructions() == null) post.setInstructions("");

            if (post.getImageFile() != null && !post.getImageFile().isEmpty()) {
                if (post.getImageFile().getSize() > 10485760) {
                    return new ResponseEntity<>(new ApiResponse("Image file too large. Max size: 10MB", false), HttpStatus.BAD_REQUEST);
                }
                try {
                    String imageUrl = fileStorageService.saveImage(post.getImageFile());
                    post.setImageUrl(imageUrl);
                } catch (Exception e) {
                    post.setImageUrl(null);
                }
            }

            if (post.getVideoFile() != null && !post.getVideoFile().isEmpty()) {
                if (post.getVideoFile().getSize() > 52428800) {
                    return new ResponseEntity<>(new ApiResponse("Video file too large. Max size: 50MB", false), HttpStatus.BAD_REQUEST);
                }
                try {
                    String videoUrl = fileStorageService.saveVideo(post.getVideoFile());
                    post.setVideoUrl(videoUrl);
                } catch (Exception e) {
                    post.setVideoUrl(null);
                }
            }

            Post createdPost = postService.createNewPost(post, reqUser.getId());
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("Error creating post: " + e.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/api/posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId, @RequestHeader("Authorization") String jwt) {
        try {
            User reqUser = userService.findUserByJwt(jwt);
            Post post = postService.findPostById(postId);

            if (post == null) {
                return new ResponseEntity<>(new ApiResponse("Post not found", false), HttpStatus.NOT_FOUND);
            }

            if (!post.getUser().getId().equals(reqUser.getId())) {
                return new ResponseEntity<>(new ApiResponse("You are not authorized to delete this post", false), HttpStatus.FORBIDDEN);
            }

            postService.deletePost(postId, reqUser.getId());
            return new ResponseEntity<>(new ApiResponse("Post deleted successfully", true), HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("Error deleting post: " + e.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/api/posts/{postId}")
    public ResponseEntity<Post> findPostByIdHandler(@PathVariable String postId) {
        try {
            Post post = postService.findPostById(postId);
            if (post == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    @PutMapping("/api/posts/{postId}/save")
    public ResponseEntity<Post> savedPostHandler(@PathVariable String postId, @RequestHeader("Authorization") String jwt) throws Exception {
        User reqUser = userService.findUserByJwt(jwt);
        Post post = postService.savedPost(postId, reqUser.getId());
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @PutMapping("/api/posts/{postId}/like")
    public ResponseEntity<Post> likePostHandler(@PathVariable String postId, @RequestHeader("Authorization") String jwt) throws Exception {
        User reqUser = userService.findUserByJwt(jwt);
        Post post = postService.likePost(postId, reqUser.getId());
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @PutMapping("/api/posts/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable String postId, @ModelAttribute Post updatedPost, @RequestHeader("Authorization") String jwt) {
        try {
            User reqUser = userService.findUserByJwt(jwt);

            if (updatedPost.getImageFile() != null && !updatedPost.getImageFile().isEmpty()) {
                if (updatedPost.getImageFile().getSize() > 10485760) {
                    return new ResponseEntity<>(new ApiResponse("Image file too large. Max size: 10MB", false), HttpStatus.BAD_REQUEST);
                }
                String imageUrl = fileStorageService.saveImage(updatedPost.getImageFile());
                updatedPost.setImageUrl(imageUrl);
            }

            if (updatedPost.getVideoFile() != null && !updatedPost.getVideoFile().isEmpty()) {
                if (updatedPost.getVideoFile().getSize() > 52428800) {
                    return new ResponseEntity<>(new ApiResponse("Video file too large. Max size: 50MB", false), HttpStatus.BAD_REQUEST);
                }
                String videoUrl = fileStorageService.saveVideo(updatedPost.getVideoFile());
                updatedPost.setVideoUrl(videoUrl);
            }

            Post updatedPostResult = postService.updatePost(postId, updatedPost, reqUser.getId());
            return new ResponseEntity<>(updatedPostResult, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("Error updating post: " + e.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
