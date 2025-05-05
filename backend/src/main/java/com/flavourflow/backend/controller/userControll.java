package com.flavourflow.backend.controller;

import com.flavourflow.backend.models.User;
import com.flavourflow.backend.service.userservices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class userControll {

    @Autowired
    private userservices userService;

    // Endpoint to get user details by user ID
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }
}
