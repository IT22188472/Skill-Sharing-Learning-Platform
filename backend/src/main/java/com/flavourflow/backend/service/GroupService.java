package com.flavourflow.backend.service;

import com.flavourflow.backend.models.Group;
import java.util.List;

public interface GroupService {
    Group createGroup(Group group, String userId) throws Exception;
    Group updateGroup(String groupId, Group group, String userId) throws Exception;
    String deleteGroup(String groupId, String userId) throws Exception; // Changed to return String
    Group findGroupById(String groupId) throws Exception;
    List<Group> getAllGroups();
    List<Group> findAllGroups(); // Added this method
    List<Group> findGroupsByUser(String userId);
    Group addMemberToGroup(String groupId, String userId, String newMemberId) throws Exception;
    Group removeMemberFromGroup(String groupId, String userId, String memberId) throws Exception;
    List<Group> searchGroups(String query);
}
