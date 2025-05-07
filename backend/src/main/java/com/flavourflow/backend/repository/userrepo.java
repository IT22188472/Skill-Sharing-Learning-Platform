package com.flavourflow.backend.repository;

import com.flavourflow.backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface userrepo extends MongoRepository<User, String> {
    // The findById method is already available from MongoRepository
}
