package com.example.social.Service;

import com.example.social.Entity.Chat;
import com.example.social.Entity.User;

import java.util.List;

public interface ChatService {
    public Chat createChat(User reqUser, User user2);

    public Chat findChatById(Integer userId) throws Exception;

    public List<Chat> findUsersChat(Integer userId);
}
