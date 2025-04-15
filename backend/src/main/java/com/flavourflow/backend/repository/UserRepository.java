package com.flavourflow.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.flavourflow.backend.models.User;

public interface UserRepository extends MongoRepository<User,String>{

    public User findByEmail(String email);

    @Query("{'$or':[ {'firstName': {$regex: ?0, $options: 'i'}}, {'lastName': {$regex: ?0, $options: 'i'}}, {'email': {$regex: ?0, $options: 'i'}} ] }")
    public List<User> searchUser(String query);

}
