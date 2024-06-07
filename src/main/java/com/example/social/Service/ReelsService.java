package com.example.social.Service;

import com.example.social.Entity.Reels;
import com.example.social.Entity.User;

import java.util.List;

public interface ReelsService {

    public Reels createReel(Reels reel, User user);

    public List<Reels> findAllRells();

    public List<Reels> findUsersReel(Integer userId) throws Exception;

    void deleteReel(Integer reelId, User user) throws Exception;
}
