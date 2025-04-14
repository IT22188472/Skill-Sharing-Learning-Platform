package com.flavourflow.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.UserRepository;
import com.flavourflow.backend.request.LoginRequest;
import com.flavourflow.backend.response.AuthResponse;
import com.flavourflow.backend.service.CustomUserDetailsService;
//import com.flavourflow.backend.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    // @Autowired
    // private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

//  /auth/signup   
     @PostMapping("/signup")
    public AuthResponse createUser(@RequestBody User user) throws Exception {

        User isExist = userRepository.findByEmail(user.getEmail());

        if (isExist!=null) {
            throw new Exception("this email already used with another account");
        }

        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setId(user.getId());//need this change to string
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setGender(user.getGender());

        User savedUser=userRepository.save(newUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword());

        String token = JwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse(token,"Register Success");

        return res;
    }

//  auth/signin    
    @PostMapping("/signin")
    public AuthResponse signin(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticate(loginRequest.getEmail(),loginRequest.getPassword());

        String token = JwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse(token,"Login Success");

        return res;
    }

    private Authentication authenticate(String email, String password) {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

        if (userDetails==null) {
            throw new BadCredentialsException("invalid username");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
              throw new BadCredentialsException("password not matched");  
        }
        return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
    }

}
