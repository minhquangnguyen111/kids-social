package com.example.social.Service.ServiceImpl;

import com.example.social.Entity.Story;
import com.example.social.Entity.User;
import com.example.social.Repository.StoryRepository;
import com.example.social.Service.StoryService;
import com.example.social.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoryServiceImpl implements StoryService {

    @Autowired
    private StoryRepository storyRepository;
    @Autowired
    private UserService userService;

    @Override
    public Story createStory(Story story, User user) {

        Story createdStory = new Story();
        createdStory.setImage(story.getImage());
        createdStory.setUser(user);
        createdStory.setCaptions(story.getCaptions());
        createdStory.setTimestamp(LocalDateTime.now());

        return storyRepository.save(createdStory);
    }

    @Override
    public List<Story> findStoryByUserId(Integer userId) throws Exception{
        User user = userService.findUserById(userId);

        return storyRepository.findByUserId(userId);
    }
}
