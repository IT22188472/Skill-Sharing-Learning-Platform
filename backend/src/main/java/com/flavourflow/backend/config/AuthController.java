package com.flavourflow.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.UserRepository;
import com.flavourflow.backend.request.LoginRequest;
import com.flavourflow.backend.response.AuthResponse;
import com.flavourflow.backend.response.ApiResponse;
import com.flavourflow.backend.service.CustomUserDetailsService;
//import com.flavourflow.backend.service.UserService;

@RestController
@RequestMapping("/auth")
<<<<<<< HEAD
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
=======
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
>>>>>>> e8cb9c1e (Follow/Unfollow User, Save/Unsave Post & Like/Unlike Post with correctly triggered Backend)
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
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setGender(user.getGender());

        User savedUser=userRepository.save(newUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword());

        String token = JwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse(token, "Register Success");
        res.setUserId(savedUser.getId());
        res.setFirstName(savedUser.getFirstName());
        res.setLastName(savedUser.getLastName());
        res.setEmail(savedUser.getEmail());

        return res;
    }

//  auth/signin    
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest loginRequest) {
        try {
            if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "Email and password are required"));
            }

            Authentication authentication = authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, "Invalid credentials"));
            }

            String token = JwtProvider.generateToken(authentication);
            User user = userRepository.findByEmail(loginRequest.getEmail());
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new AuthResponse(null, "User not found"));
            }
            
            AuthResponse res = new AuthResponse(token, "Login Success");
            res.setUserId(user.getId());
            res.setFirstName(user.getFirstName());
            res.setLastName(user.getLastName());
            res.setEmail(user.getEmail());

            return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .body(res);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, "Invalid credentials: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse(null, "Error during authentication: " + e.getMessage()));
        }
    }

    @PostMapping("/signout")
    public ResponseEntity<ApiResponse> signout() {
        // Server-side logout is typically just a formality since JWTs are stateless
        // The client should remove the token from localStorage
        return new ResponseEntity<>(new ApiResponse("Logged out successfully", true), HttpStatus.OK);
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
