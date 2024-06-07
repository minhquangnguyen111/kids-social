package com.example.social.Controller;

import com.example.social.Entity.Story;
import com.example.social.Entity.User;
import com.example.social.Service.StoryService;
import com.example.social.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class StoryController {

    @Autowired
    private StoryService storyService;

    @Autowired
    private UserService userService;

    @PostMapping("/api/story")
    public Story createStory(@RequestBody Story story, @RequestHeader("Authorization") String jwt) {

        User reqUser = userService.findUserByJwt(jwt);
        Story createdStory = storyService.createStory(story,reqUser);

        return createdStory;
    }

    @GetMapping("/api/story/user/{userId}")
    public List<Story> findUsersStory( @RequestHeader("Authorization") String jwt,
                                 @PathVariable Integer userId) throws Exception {

        User reqUser = userService.findUserByJwt(jwt);
        List<Story> stories = storyService.findStoryByUserId(userId);

        return stories;
    }


}
