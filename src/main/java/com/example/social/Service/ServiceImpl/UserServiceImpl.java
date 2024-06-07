package com.example.social.Service.ServiceImpl;

import com.example.social.Config.JwtProvider;
import com.example.social.Entity.User;
import com.example.social.Exceptions.UserException;
import com.example.social.Repository.UserRepository;
import com.example.social.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public User registerUser(User user) {
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPassword(user.getPassword());
        newUser.setId(user.getId());
        User savedUser = userRepository.save(newUser);
        return savedUser;
    }

    @Override
    public User findUserById(Integer userId) throws UserException {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get();
        }
        throw new UserException("User not exist with userId" + userId);
    }

    @Override
    public User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return user;
    }

    @Override
    public User followUser(Integer reqUserId, Integer userId2) throws UserException {
        User reqUser = findUserById(reqUserId);
        User user2 = findUserById(userId2);

        user2.getFollowers().add(reqUser.getId());
        reqUser.getFollowings().add(user2.getId());

        userRepository.save(reqUser);
        userRepository.save(user2);
        return reqUser;
    }


    @Override
    public User updateUser(User user, Integer userId) throws UserException {
        Optional<User> user1 = userRepository.findById(userId);
        if (user1.isEmpty()) {
            throw new UserException("User not exist with id" + userId);
        }
        User oldUser = user1.get();
        // Cập nhật email nếu được cung cấp
        if (user.getEmail() != null) {
            oldUser.setEmail(user.getEmail());
        }

        // Cập nhật firstname nếu được cung cấp
        if (user.getFirstName() != null) {
            oldUser.setFirstName(user.getFirstName());
        }

        // Cập nhật lastname nếu được cung cấp
        if (user.getLastName() != null) {
            oldUser.setLastName(user.getLastName());
        }

        // Cập nhật password nếu được cung cấp
        if (user.getPassword() != null) {
            oldUser.setPassword(user.getPassword());
        }
        if (user.getAvatar() != null) {
            oldUser.setAvatar(user.getAvatar());
        }
        if (user.getGender() != null) {
            oldUser.setGender(user.getGender());
        }
        if (user.getCover() != null) {
            oldUser.setCover(user.getCover());
        }
        if (user.getBio() != null) {
            oldUser.setBio(user.getBio());
        }
        User updatedUser = userRepository.save(oldUser);
        return updatedUser;
    }


    @Override
    public List<User> searchUser(String query) {

        return userRepository.searchUser(query);
    }

    @Override
    public User findUserByJwt(String jwt) {

        String email = JwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);
        return user;
    }

    public void save(User user) {
        userRepository.save(user);
    }


}
