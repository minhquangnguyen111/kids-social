package com.example.social.Repository;

import com.example.social.Entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {

    @Query("Select p from Post p where p.user.id =:userId")
    List<Post> findPostByUserId(Integer userId);

}
