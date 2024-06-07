package com.example.social.Entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class GoogleOAuthResponse {
    private String given_name;
    private String family_name;
    private String email;
    private String picture;
}
