// package com.example.debating;

// import org.springframework.stereotype.Service;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RestController;
// import java.time.Instant;
// import org.springframework.web.bind.annotation.RequestMapping;


package com.example.debating;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.Instant;
import org.springframework.security.crypto.password.PasswordEncoder;

class UserLoginRequest
{
    private String email;
    private String password;
    private String token;
    private String googleId;
    private Instant timestamp;
    

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
// @RestController
// @RequestMapping("/api/user")
// public class UserLogInOut
// {

//     // @PostMapping("/signin/email")
//     // public String signInEmail(@RequestBody UserLoginRequest request)
//     // {
//     //     // add new user to the database

//     //     return "User signed in successfully!";
//     // }
//     @PostMapping("/signup/email")
//     public String signUp(@RequestBody UserLoginRequest request) {

//         User user = new User();

//         user.setEmail(request.getEmail());
//         user.setPassword(
//             passwordEncoder.encode(request.getPassword())
//         );
//         user.setRole("USER"); // Set default role

//         userRepository.save(user);

//         return "User registered successfully!";
//     }


//     @PostMapping("/signin/google")
//     public String signInGoogle(@RequestBody UserLoginRequest request)
//     {
//         // Implement Google sign-in logic here
//         return "User signed in with Google successfully!";
//     }

//     @PostMapping("/login/email")
//     public String login(@RequestBody UserLoginRequest request)
//     {
//         // Implement login logic here
//         return "User logged in successfully!";
//     }

//     @PostMapping("/logout")
//     public String logout()
//     {
//         // Implement logout logic here
//         return "User logged out successfully!";
//     }
// }




@RestController
@RequestMapping("/auth")
public class UserLogInOut {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup/email")
    public String signUp(@RequestBody UserLoginRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        return "User registered successfully!";
    }
}