package com.saas.analytics.service;

import com.saas.analytics.dto.LicenseUtilizationDTO;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class LicenseUtilizationService {
    public List<LicenseUtilizationDTO> calculateUtilization() {
        return new ArrayList<>();
    }
}
