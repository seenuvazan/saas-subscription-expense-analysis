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
    private String fullName;
    private Department department;
    private Role role;
}
