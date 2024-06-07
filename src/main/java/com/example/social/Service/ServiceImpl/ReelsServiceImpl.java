package com.example.social.Service.ServiceImpl;

import com.example.social.Entity.Reels;
import com.example.social.Entity.User;
import com.example.social.Repository.ReelsRepository;
import com.example.social.Service.ReelsService;
import com.example.social.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReelsServiceImpl implements ReelsService {

    @Autowired
    private ReelsRepository reelsRepository;

    @Autowired
    private UserService userService;

    @Override
    public Reels createReel(Reels reel, User user) {

        Reels createReel = new Reels();
        createReel.setTitle(reel.getTitle());
        createReel.setUser(user);
        createReel.setVideo(reel.getVideo());
        createReel.setCreateAt(LocalDateTime.now());

        return reelsRepository.save(createReel);
    }

    @Override
    public List<Reels> findAllRells() {

        return reelsRepository.findAll();
    }

    @Override
    public List<Reels> findUsersReel(Integer userId) throws Exception {
        userService.findUserById(userId);

        return reelsRepository.findByUserId(userId);

    }

    @Override
    public void deleteReel(Integer reelId, User user) throws Exception {
        Reels reel = reelsRepository.findById(reelId)
                .orElseThrow(() -> new Exception("Reel not found with id " + reelId));

        if (!reel.getUser().getId().equals(user.getId())) {
            throw new Exception("You are not authorized to delete this reel");
        }

        reelsRepository.delete(reel);
    }
}
