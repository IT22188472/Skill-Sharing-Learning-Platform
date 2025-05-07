package com.flavourflow.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flavourflow.backend.models.Group;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.GroupRepository;

@Service
public class GroupServiceImplementation implements GroupService {

    @Autowired
    private GroupRepository groupRepository;
    
    @Autowired
    private UserService userService;
    
    @Override
    public Group createGroup(Group group, String userId) throws Exception {
        User creator = userService.findUserById(userId);
        if (creator == null) {
            throw new Exception("User not found");
        }

        group.setCreator(creator);
        group.setMembers(new ArrayList<>(List.of(creator)));
        return groupRepository.save(group);
    }

    @Override
    public Group updateGroup(String groupId, Group updatedGroup, String userId) throws Exception {
        Group existingGroup = findGroupById(groupId);
        if (!existingGroup.getCreator().getId().equals(userId)) {
            throw new Exception("Only the creator can update the group");
        }

        existingGroup.setName(updatedGroup.getName());
        existingGroup.setDescription(updatedGroup.getDescription());
        return groupRepository.save(existingGroup);
    }

    @Override
    public String deleteGroup(String groupId, String userId) throws Exception {
        Group group = findGroupById(groupId);
        if (!group.getCreator().getId().equals(userId)) {
            throw new Exception("Only the creator can delete the group");
        }
        groupRepository.delete(group);
        return "Group deleted successfully";
    }

    @Override
    public Group findGroupById(String groupId) throws Exception {
        return groupRepository.findById(groupId)
            .orElseThrow(() -> new Exception("Group not found with id: " + groupId));
    }

    @Override
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    @Override
    public List<Group> findGroupsByUser(String userId) {
        return groupRepository.findByCreatorIdOrMembersId(userId, userId);
    }

    @Override
    public Group addMemberToGroup(String groupId, String userId, String newMemberId) throws Exception {
        Group group = findGroupById(groupId);
        User requestUser = userService.findUserById(userId);
        User newMember = userService.findUserById(newMemberId);
        
        // Only creator can add members
        if (!group.getCreator().getId().equals(requestUser.getId())) {
            throw new Exception("Only the creator can add members to the group");
        }
        
        // Check if user is already a member
        if (group.getMembers().stream().anyMatch(member -> member.getId().equals(newMember.getId()))) {
            throw new Exception("User is already a member of this group");
        }
        
        group.getMembers().add(newMember);
        return groupRepository.save(group);
    }

    @Override
    public Group removeMemberFromGroup(String groupId, String userId, String memberId) throws Exception {
        Group group = findGroupById(groupId);
        User requestUser = userService.findUserById(userId);
        User memberToRemove = userService.findUserById(memberId);
        
        // Only creator can remove members
        if (!group.getCreator().getId().equals(requestUser.getId())) {
            throw new Exception("Only the creator can remove members from the group");
        }
        
        // Creator cannot be removed
        if (memberToRemove.getId().equals(group.getCreator().getId())) {
            throw new Exception("Creator cannot be removed from the group");
        }
        
        boolean removed = group.getMembers().removeIf(member -> member.getId().equals(memberId));
        
        if (!removed) {
            throw new Exception("User is not a member of this group");
        }
        
        return groupRepository.save(group);
    }

    @Override
    public List<Group> searchGroups(String query) {
        return groupRepository.searchGroups(query);
    }

    @Override
    public List<Group> findAllGroups() {
        return groupRepository.findAll();
    }
}
