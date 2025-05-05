package com.flavourflow.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.flavourflow.backend.models.GroupMessage;

@Repository
public interface GroupMessageRepository extends MongoRepository<GroupMessage, String> {
    
    List<GroupMessage> findByGroupIdOrderByCreatedAtAsc(String groupId);
    
}
