package com.flavourflow.backend.controller;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flavourflow.backend.models.Group;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.request.GroupRequest;
import com.flavourflow.backend.response.ApiResponse;
import com.flavourflow.backend.service.FileStorageService;
import com.flavourflow.backend.service.GroupService;
import com.flavourflow.backend.service.UserService;

@RestController

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
@RequestMapping("/api/groups")
public class GroupController {
    
    private static final Logger logger = Logger.getLogger(GroupController.class.getName());

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    // Handle JSON requests
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createGroupJson(@RequestBody GroupRequest groupRequest, 
                                         @RequestHeader("Authorization") String jwt) {
        logger.info("Received JSON request to create group: " + groupRequest);
        return createGroupInternal(groupRequest, jwt);
    }
    
    // Handle form data requests
    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> createGroupForm(GroupRequest groupRequest,
                                        @RequestHeader("Authorization") String jwt) {
        logger.info("Received form request to create group: " + groupRequest);
        return createGroupInternal(groupRequest, jwt);
    }

    // Handle general requests (fallback)
    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody GroupRequest groupRequest,
                                     @RequestHeader("Authorization") String jwt) {
        try {
            logger.info("Received request to create group: " + groupRequest);
            
            // Validate request data
            if (groupRequest == null) {
                return new ResponseEntity<>(new ApiResponse("Group data is missing", false),
                        HttpStatus.BAD_REQUEST);
            }
            
            if (groupRequest.getName() == null || groupRequest.getName().trim().isEmpty()) {
                return new ResponseEntity<>(new ApiResponse("Group name is required", false),
                        HttpStatus.BAD_REQUEST);
            }
            
            // Extract user from JWT
            User reqUser = userService.findUserByJwt(jwt);
            if (reqUser == null) {
                return new ResponseEntity<>(new ApiResponse("User not authenticated", false),
                        HttpStatus.UNAUTHORIZED);
            }
            
            // Create group entity from request
            Group group = new Group();
            group.setName(groupRequest.getName());
            group.setDescription(groupRequest.getDescription());
            
            // Log the data we're about to save
            logger.info("Saving group with name: " + group.getName() + ", description: " + group.getDescription());
            
            // Save group
            Group newGroup = groupService.createGroup(group, reqUser.getId());
            return new ResponseEntity<>(newGroup, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.severe("Error creating group: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse("Error creating group: " + e.getMessage(), false),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Common implementation for creating a group
    private ResponseEntity<?> createGroupInternal(GroupRequest groupRequest, String jwt) {
        try {
            // Validate request data
            if (groupRequest == null) {
                return new ResponseEntity<>(new ApiResponse("Group data is missing", false),
                        HttpStatus.BAD_REQUEST);
            }
            
            if (groupRequest.getName() == null || groupRequest.getName().trim().isEmpty()) {
                return new ResponseEntity<>(new ApiResponse("Group name is required", false),
                        HttpStatus.BAD_REQUEST);
            }
            
            // Extract user from JWT
            User reqUser = userService.findUserByJwt(jwt);
            if (reqUser == null) {
                return new ResponseEntity<>(new ApiResponse("User not authenticated", false),
                        HttpStatus.UNAUTHORIZED);
            }
            
            // Create group entity from request
            Group group = new Group();
            group.setName(groupRequest.getName());
            group.setDescription(groupRequest.getDescription());
            
            // Save group
            Group newGroup = groupService.createGroup(group, reqUser.getId());
            return new ResponseEntity<>(newGroup, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.severe("Error creating group: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(new ApiResponse("Error creating group: " + e.getMessage(), false),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> groups = groupService.findAllGroups();
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<?> getGroupById(@PathVariable String groupId) {
        try {
            Group group = groupService.findGroupById(groupId);
            return new ResponseEntity<>(group, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/api/users/{userId}/groups")
    public ResponseEntity<List<Group>> getGroupsByUser(@PathVariable String userId) {
        List<Group> groups = groupService.findGroupsByUser(userId);
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Group>> searchGroups(@RequestParam("query") String query) {
        List<Group> groups = groupService.searchGroups(query);
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<?> updateGroup(@PathVariable String groupId, @RequestBody Group group,
            @RequestHeader("Authorization") String jwt) {
        try {
            User reqUser = userService.findUserByJwt(jwt);
            Group existingGroup = groupService.findGroupById(groupId);
            
            if (!existingGroup.getCreator().getId().equals(reqUser.getId())) {  // Changed from owner to creator
                return new ResponseEntity<>(new ApiResponse("Not authorized to update this group", false),
                        HttpStatus.FORBIDDEN);
            }
            
            Group updatedGroup = groupService.updateGroup(groupId, group, reqUser.getId());
            return new ResponseEntity<>(updatedGroup, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<?> deleteGroup(
            @PathVariable String groupId,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwt(jwt);
            String result = groupService.deleteGroup(groupId, user.getId());
            return new ResponseEntity<>(new ApiResponse(result, true), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<?> addMemberToGroup(
            @PathVariable String groupId,
            @PathVariable String memberId,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwt(jwt);
            Group group = groupService.addMemberToGroup(groupId, user.getId(), memberId);
            return new ResponseEntity<>(group, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<?> removeMemberFromGroup(
            @PathVariable String groupId,
            @PathVariable String memberId,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwt(jwt);
            Group group = groupService.removeMemberFromGroup(groupId, user.getId(), memberId);
            return new ResponseEntity<>(group, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.FORBIDDEN);
        }
    }
    
    @GetMapping("/{groupId}/members")
    public ResponseEntity<?> getGroupMembers(@PathVariable String groupId, @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwt(jwt);
            if (user == null) {
                return new ResponseEntity<>(new ApiResponse("User not authenticated", false), HttpStatus.UNAUTHORIZED);
            }
            
            Group group = groupService.findGroupById(groupId);
            return new ResponseEntity<>(group.getMembers(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/{groupId}/join")
    public ResponseEntity<?> joinGroup(@PathVariable String groupId, @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwt(jwt);
            if (user == null) {
                return new ResponseEntity<>(new ApiResponse("User not authenticated", false), HttpStatus.UNAUTHORIZED);
            }
            
            Group group = groupService.findGroupById(groupId);
            
            // Check if user is already a member
            boolean isMember = group.getMembers().stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
                
            if (isMember) {
                return new ResponseEntity<>(new ApiResponse("User is already a member of this group", false), HttpStatus.BAD_REQUEST);
            }
            
            // Add user to group members using the addMemberToGroup method
            // This method is called by the creator, so we use the creator's ID
            Group updatedGroup = groupService.addMemberToGroup(groupId, group.getCreator().getId(), user.getId());
            
            return new ResponseEntity<>(updatedGroup, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/{groupId}/leave")
    public ResponseEntity<?> leaveGroup(@PathVariable String groupId, @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwt(jwt);
            if (user == null) {
                return new ResponseEntity<>(new ApiResponse("User not authenticated", false), HttpStatus.UNAUTHORIZED);
            }
            
            Group group = groupService.findGroupById(groupId);
            
            // Check if user is the creator
            if (group.getCreator().getId().equals(user.getId())) {
                return new ResponseEntity<>(new ApiResponse("Group creator cannot leave the group", false), HttpStatus.BAD_REQUEST);
            }
            
            // Check if user is a member
            boolean isMember = group.getMembers().stream()
                .anyMatch(member -> member.getId().equals(user.getId()));
                
            if (!isMember) {
                return new ResponseEntity<>(new ApiResponse("User is not a member of this group", false), HttpStatus.BAD_REQUEST);
            }
            
            // Remove user from group members
            group.setMembers(group.getMembers().stream()
                .filter(member -> !member.getId().equals(user.getId()))
                .toList());
                
            Group updatedGroup = groupService.updateGroup(groupId, group, group.getCreator().getId());
            
            return new ResponseEntity<>(updatedGroup, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
