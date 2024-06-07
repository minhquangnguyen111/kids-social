package com.example.social.Service;

import com.example.social.Entity.Story;
import com.example.social.Entity.User;

import java.util.List;

public interface StoryService {

    public Story createStory(Story story, User user);

    public List<Story> findStoryByUserId(Integer userId) throws Exception;

}
