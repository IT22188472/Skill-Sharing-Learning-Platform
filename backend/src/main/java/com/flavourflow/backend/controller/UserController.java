package com.flavourflow.backend.controller;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.UserRepository;
import com.flavourflow.backend.service.UserService;


@RestController
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;
    
    
    @GetMapping("/api/users")
    public List<User> getUsers(){

        List<User> users = userRepository.findAll();

        return users;

    }

    @GetMapping("/api/users/{userId}")
    public User getUserById(@PathVariable("userId")String id) throws Exception{

        User user=userService.findUserById(id);

        return user;

    }

    @PutMapping("/api/users/{userId}")
    public User uptadeUser(@RequestBody User user,@PathVariable String userId) throws Exception{
       
        User updatUser=userService.updateUser(user,userId);

        return updatUser;
        
    }


    @PutMapping("/api/users/follow/{userId1}/{userId2}")
    public User followUserHandler(@PathVariable String userId1,@PathVariable String userId2) throws Exception{

        User user=userService.followUser(userId1, userId2);
        return user;
    }

    @GetMapping("/api/users/search")
    public List<User> searchUser(@RequestParam("query") String query){

        List<User> users = userService.searchUser(query);

        return users;
    }

}
