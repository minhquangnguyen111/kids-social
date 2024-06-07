package com.example.social.Service;

import com.example.social.Entity.Chat;
import com.example.social.Entity.Message;
import com.example.social.Entity.User;
import com.example.social.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface MessageService {

    public Message createMessage(User user, Integer chatId, Message req) throws Exception;

    public List<Message> findChatsMessages(Integer chatId) throws Exception;


}
