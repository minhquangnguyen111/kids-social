package com.example.social.Controller;

import com.example.social.Entity.Post;
import com.example.social.Entity.Reels;
import com.example.social.Entity.User;
import com.example.social.Service.ReelsService;
import com.example.social.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
public class ReelsController {

    @Autowired
    private ReelsService reelsService;

    @Autowired
    private UserService userService;

    @PostMapping("/api/reels")
    public Reels createReels(@RequestBody Reels reels,
                             @RequestHeader("Authorization") String jwt) {
        User reqUser = userService.findUserByJwt(jwt);
        Reels createdReels = reelsService.createReel(reels, reqUser);

        return createdReels;
    }

    @GetMapping("/api/reels")
    public List<Reels> findAllReels(@RequestHeader("Authorization") String jwt) {
        List<Reels> reels = reelsService.findAllRells();
        reels.sort(Comparator.comparing(Reels::getCreateAt).reversed());
        return reels;
    }

    @GetMapping("/api/reels/user/{userId}")
    public List<Reels> findUsersReels(@RequestHeader("Authorization") String jwt, @PathVariable Integer userId) throws Exception {

        List<Reels> reels = reelsService.findUsersReel(userId);
        reels.sort(Comparator.comparing(Reels::getCreateAt).reversed());
        return reels;
    }

    @DeleteMapping("/api/reels/{reelId}")
    public ResponseEntity<?> deleteReel(@RequestHeader("Authorization") String jwt, @PathVariable Integer reelId) {
        try {
            User reqUser = userService.findUserByJwt(jwt);
            reelsService.deleteReel(reelId, reqUser);
            return ResponseEntity.ok("Reel deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}



