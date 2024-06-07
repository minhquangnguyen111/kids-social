package com.example.social.Service.ServiceImpl;

import com.example.social.Entity.Chat;
import com.example.social.Entity.User;
import com.example.social.Repository.ChatRepository;
import com.example.social.Service.ChatService;
import com.example.social.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserService userService;


    @Override
    public Chat createChat(User reqUser, User user2) {

        Chat isExist = chatRepository.findChatByUsersId(user2, reqUser);

        //nếu có user trong chat -> không tạo lại
        if (isExist != null) {
            return isExist;
        }
        Chat chat = new Chat();
        chat.getUsers().add(user2);
        chat.getUsers().add(reqUser);
        chat.setTimestamp(LocalDateTime.now());

        return chatRepository.save(chat);
    }

    @Override
    public Chat findChatById(Integer chatId) throws Exception {

        Optional<Chat> opt = chatRepository.findById(chatId);

        if (opt.isEmpty()) {
            throw new Exception("Chat not found with id:" + chatId);
        }

        return opt.get();
    }

    @Override
    public List<Chat> findUsersChat(Integer userId) {

        return chatRepository.findByUsersId(userId);
    }
}
