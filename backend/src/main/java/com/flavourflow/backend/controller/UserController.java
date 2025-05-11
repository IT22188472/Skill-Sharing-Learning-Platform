package com.flavourflow.backend.controller;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.UserRepository;
import com.flavourflow.backend.service.UserService;


@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
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

    @PutMapping("/api/users")
    public User uptadeUser(@RequestHeader("Authorization")String jwt, @RequestBody User user) throws Exception{

        User reqUser = userService.findUserByJwt(jwt);
       
        User updatUser = userService.updateUser(user,reqUser.getId());

        return updatUser;
        
    }


    @PutMapping("/api/users/follow/{userId2}")
    public User followUserHandler(@RequestHeader("Authorization")String jwt, @PathVariable String userId2) throws Exception{
        User reqUser = userService.findUserByJwt(jwt);

        User user=userService.followUser(reqUser.getId(), userId2);

        return user;
    }

    @GetMapping("/api/users/search")
    public List<User> searchUser(@RequestParam("query") String query){

        List<User> users = userService.searchUser(query);

        return users;
    }

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> getUserFromToken(@RequestHeader("Authorization")String jwt) {
        try {
            User user = userService.findUserByJwt(jwt);
            
            if (user == null) {
                return new ResponseEntity<>(null, new org.springframework.http.HttpHeaders(), HttpStatus.UNAUTHORIZED);
            }
            
            // Don't send the password back to the client
            user.setPassword(null);
            
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, new org.springframework.http.HttpHeaders(), HttpStatus.UNAUTHORIZED);
        }
    }

}
