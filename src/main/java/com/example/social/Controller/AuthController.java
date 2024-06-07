package com.example.social.Controller;

import com.example.social.Config.JwtProvider;
import com.example.social.Entity.GoogleOAuthResponse;
import com.example.social.Entity.User;
import com.example.social.Repository.UserRepository;
import com.example.social.Request.LoginRequest;
import com.example.social.Response.AuthResponse;
import com.example.social.Service.ServiceImpl.CustomerUserDetailsService;
import com.example.social.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomerUserDetailsService customerUserDetails;

    @PostMapping("/signup")
    public AuthResponse createUser(@RequestBody User user) throws Exception {
        //Kiem tra email da ton tai chua
        User isExist = userRepository.findByEmail(user.getEmail());

        if (isExist != null) {
            throw new Exception("Email already used with another account ");
        }

        User newUser = new User();

        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        //encoder password
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(newUser);

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(savedUser.getPassword(), savedUser.getEmail());

        String token = JwtProvider.generateToken(authentication);
//        String email = JwtProvider.getEmailFromJwtToken(token);
        AuthResponse res = new AuthResponse(token, "Register success!");
        return res;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            String token = JwtProvider.generateToken(authentication);
            AuthResponse res = new AuthResponse(token, "Login success!");
            return ResponseEntity.ok(res);
        } catch (AuthenticationException e) {
            AuthResponse response = new AuthResponse(null, "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String jwt, HttpServletRequest request) {
        // Kiểm tra xem token JWT có hợp lệ hay không
        if (jwt == null || jwt.isEmpty() || !jwt.startsWith("Bearer ")) {
            // Nếu token không hợp lệ, trả về lỗi
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ.");
        }

        // Lấy token từ header Authorization
        String token = jwt.substring(7); // Bỏ đi phần "Bearer "


        // Kiểm tra xem người dùng đã đăng nhập chưa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            // Nếu người dùng chưa đăng nhập, trả về lỗi
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập.");
        }

        // Nếu đã đăng nhập, xóa thông tin xác thực khỏi bộ nhớ của Spring Security
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Đăng xuất thành công.");
    }

    private Authentication authenticate(String email, String password) {

        UserDetails userDetails = customerUserDetails.loadUserByUsername(email);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Password not matched");
        }
//        System.out.println(userDetails);
//        System.out.println(userDetails.getUsername());
//        System.out.println(userDetails.getAuthorities());
        return new UsernamePasswordAuthenticationToken(userDetails, userDetails.getUsername(), userDetails.getAuthorities());
    }


}
