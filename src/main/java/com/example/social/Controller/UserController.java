package com.example.social.Controller;

import com.example.social.Entity.User;
import com.example.social.Exceptions.UserException;
import com.example.social.Repository.UserRepository;
import com.example.social.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
public class UserController {

    @Autowired
    public UserRepository userRepository;
    @Autowired
    UserService userService;


    @GetMapping("/api/users")
    public List<User> getUsers(@RequestHeader("Authorization") String jwt) {

        return userRepository.findAll();
    }

    @GetMapping("/api/users/{userId}")
    public User getUserById(@RequestHeader("Authorization") String jwt, @PathVariable("userId") Integer userId) throws UserException {
        User user = userService.findUserById(userId);
        return user;
    }

    @PatchMapping("/api/users")
    public User updateUser(@RequestHeader("Authorization") String jwt,
                           @RequestBody User user) throws UserException {

        User reqUser = userService.findUserByJwt(jwt);

        User updatedUser = userService.updateUser(user, reqUser.getId());
        return updatedUser;
    }

    @PutMapping("/api/users/follow/{userId2}")
    public User followUserHandler(@RequestHeader("Authorization") String jwt,
                                  @PathVariable Integer userId2) throws UserException {

        User reqUser = userService.findUserByJwt(jwt);
        User followedUser = userRepository.findById(userId2).orElseThrow(() -> new UserException("User not found"));

        // Kiểm tra xem người dùng đã follow người dùng khác chưa
        if (reqUser.getFollowings().contains(followedUser.getId())) {
            // Nếu đã follow rồi, thực hiện unfollow
            reqUser.getFollowings().remove(followedUser.getId());
            followedUser.getFollowers().remove(reqUser.getId());
        } else {
            // Nếu chưa follow, thực hiện follow
            reqUser.getFollowings().add(followedUser.getId());
            followedUser.getFollowers().add(reqUser.getId());
        }
        userRepository.save(reqUser);
        userRepository.save(followedUser);

        // Trả về danh sách người dùng sau khi thực hiện follow/unfollow
        return reqUser;
    }


    @GetMapping("/api/users/search")
    public List<User> searchUser(@RequestParam("query") String query) {
        List<User> users = userService.searchUser(query);
        return users;
    }

    @GetMapping("/api/users/profile")
    public User getUserFromToken(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserByJwt(jwt);

        user.setPassword(null);

        return user;
    }


}
