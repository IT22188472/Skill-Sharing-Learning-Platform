package com.flavourflow.backend.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.flavourflow.backend.models.Group;

public interface GroupRepository extends MongoRepository<Group, String> {
    
    @Query("{ $or: [ { 'creator._id': ?0 }, { 'members._id': ?1 } ] }")
    List<Group> findByCreatorIdOrMembersId(String creatorId, String memberId);
    
    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    List<Group> searchGroups(String query);
}
