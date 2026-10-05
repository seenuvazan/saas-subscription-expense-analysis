package com.saas.analytics.dto;

import com.saas.analytics.model.Department;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email format")
    private String email;

    private String phone;

    private LocalDate dateOfBirth;

    private String gender;

    private String jobTitle;

    private Department department;

    private String employeeId;

    private String location;

    @Size(max = 250, message = "Bio cannot exceed 250 characters")
    private String bio;

    private String avatarUrl;
}
