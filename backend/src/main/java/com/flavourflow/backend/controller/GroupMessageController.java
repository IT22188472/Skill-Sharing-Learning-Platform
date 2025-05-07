package com.flavourflow.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flavourflow.backend.models.Group;
import com.flavourflow.backend.models.GroupMessage;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.GroupMessageRepository;
import com.flavourflow.backend.response.ApiResponse;
import com.flavourflow.backend.service.GroupService;
import com.flavourflow.backend.service.UserService;

@RestController
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:8080"})
@RequestMapping("/api/groups")
public class GroupMessageController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupMessageRepository groupMessageRepository;

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<?> getGroupMessages(@PathVariable String groupId, @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwt(jwt);
            if (user == null) {
                return new ResponseEntity<>(new ApiResponse("User not authenticated", false), HttpStatus.UNAUTHORIZED);
            }
            
            Group group = groupService.findGroupById(groupId);
            
            // Check if user is a member of the group
            boolean isMember = group.getMembers().stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
                
            if (!isMember && !group.getCreator().getId().equals(user.getId())) {
                return new ResponseEntity<>(new ApiResponse("You must be a member of the group to view messages", false), HttpStatus.FORBIDDEN);
            }
            
            List<GroupMessage> messages = groupMessageRepository.findByGroupIdOrderByCreatedAtAsc(groupId);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{groupId}/messages")
    public ResponseEntity<?> createGroupMessage(
            @PathVariable String groupId,
            @RequestBody MessageRequest messageRequest,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwt(jwt);
            if (user == null) {
                return new ResponseEntity<>(new ApiResponse("User not authenticated", false), HttpStatus.UNAUTHORIZED);
            }
            
            Group group = groupService.findGroupById(groupId);
            
            // Check if user is a member of the group
            boolean isMember = group.getMembers().stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
                
            if (!isMember && !group.getCreator().getId().equals(user.getId())) {
                return new ResponseEntity<>(new ApiResponse("You must be a member of the group to send messages", false), HttpStatus.FORBIDDEN);
            }
            
            if (messageRequest.getContent() == null || messageRequest.getContent().trim().isEmpty()) {
                return new ResponseEntity<>(new ApiResponse("Message content cannot be empty", false), HttpStatus.BAD_REQUEST);
            }
            
            GroupMessage message = new GroupMessage(groupId, user, messageRequest.getContent());
            message.setCreatedAt(LocalDateTime.now());
            
            GroupMessage savedMessage = groupMessageRepository.save(message);
            return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Request class for message creation
    public static class MessageRequest {
        private String content;
        
        public MessageRequest() {
        }
        
        public MessageRequest(String content) {
            this.content = content;
        }
        
        public String getContent() {
            return content;
        }
        
        public void setContent(String content) {
            this.content = content;
        }
    }
}
