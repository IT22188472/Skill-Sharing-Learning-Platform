package com.flavourflow.backend.service;

import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.userrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class userservices {

    @Autowired
    private userrepo userRepository;

    // Method to get user details by user ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
}
