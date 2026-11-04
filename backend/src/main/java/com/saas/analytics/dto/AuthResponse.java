package com.saas.analytics.dto;

import com.saas.analytics.model.Department;
import com.saas.analytics.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String jobTitle;
    private String phone;
    private String avatarUrl;
    private Department department;
    private Role role;
}
