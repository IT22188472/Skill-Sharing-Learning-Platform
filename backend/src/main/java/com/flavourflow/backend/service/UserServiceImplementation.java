package com.flavourflow.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flavourflow.backend.config.JwtProvider;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.UserRepository;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public User registerUser(User user) {
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPassword(user.getPassword());
        newUser.setGender(user.getGender());
        newUser.setId(user.getId());

        User savedUser=userRepository.save(newUser);

        return savedUser;

    }

    @Override
    public User findUserById(String userId) throws Exception {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            return user.get();
        }

        throw new Exception("user not exist with userid"+userId);

    }

    @Override
    public User findUserByEmail(String email) {
        User user=userRepository.findByEmail(email);
        return user;
    }

    @Override
    public User followUser(String reqUserId, String userId2) throws Exception {

<<<<<<< HEAD
        User reqUser=findUserById(reqUserId);

        User user2=findUserById(userId2);

        user2.getFollowers().add(reqUser.getId());
        reqUser.getFollowing().add(user2.getId());

        userRepository.save(reqUser);
        userRepository.save(user2);

=======
        
        User reqUser = findUserById(reqUserId); // Find the requesting user
        User user2 = findUserById(userId2);     // Find the user to follow
    
        
        if (reqUser.getFollowing().contains(user2.getId())) {
            
            reqUser.getFollowing().remove(user2.getId());
            user2.getFollowers().remove(reqUser.getId());
        } else {
            
            reqUser.getFollowing().add(user2.getId());
            user2.getFollowers().add(reqUser.getId());
        }
    
        
        userRepository.save(reqUser);
        userRepository.save(user2);
    
>>>>>>> e8cb9c1e (Follow/Unfollow User, Save/Unsave Post & Like/Unlike Post with correctly triggered Backend)
        return reqUser;
    }

    @Override
    public User updateUser(User user,String userId) throws Exception {
        Optional<User> user1 = userRepository.findById(userId);

        if (user1.isEmpty()) {
            throw new Exception("user not exit with id: "+userId);
        }

        User oldUser=user1.get();

        if (user.getFirstName()!=null) {
            oldUser.setFirstName(user.getFirstName());
        }

        if (user.getLastName()!=null) {
            oldUser.setLastName(user.getLastName());
        }

        if (user.getEmail()!=null) {
            oldUser.setEmail(user.getEmail());
        }

        if (user.getGender()!=null) {
            oldUser.setGender(user.getGender());
        }

        User updatUser=userRepository.save(oldUser);

        return updatUser;
    }

    @Override
    public List<User> searchUser(String query) {
        return userRepository.searchUser(query);
    }

    @Override
    public User findUserByJwt(String jwt) {
        try {
            // Log the JWT for debugging
            System.out.println("JWT received: " + (jwt.length() > 20 ? jwt.substring(0, 20) + "..." : jwt));
            
            // Check if the Bearer prefix is present
            if (jwt.startsWith("Bearer ")) {
                jwt = jwt.substring(7);
            }
            
            String email = JwtProvider.getEmailFromJwtToken(jwt);
            System.out.println("Email extracted from JWT: " + email);
            
            User user = userRepository.findByEmail(email);
            if (user == null) {
                System.out.println("No user found with email: " + email);
            }
            
            return user;
        } catch (Exception e) {
            System.err.println("Error processing JWT: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

}
