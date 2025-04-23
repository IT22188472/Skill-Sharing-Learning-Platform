package com.flavourflow.backend.service;

import java.util.List;

import com.flavourflow.backend.models.User;

public interface UserService {

    public User registerUser(User user);

    public User findUserById(String userId) throws Exception;

    public User findUserByEmail(String email);

    public User followUser(String userId1,String userId2) throws Exception;

    public User updateUser(User user,String userId) throws Exception;

    public List<User> searchUser(String query);

    public User findUserByJwt(String jwt);

}
