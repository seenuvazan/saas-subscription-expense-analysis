package com.saas.analytics.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private final Path rootUploadPath = Paths.get("data", "uploads", "invoices").toAbsolutePath().normalize();

    public FileStorageService() {
        try {
            Files.createDirectories(rootUploadPath);
        } catch (IOException e) {
            log.error("Could not initialize upload folder: {}", e.getMessage());
        }
    }

    public String storeVendorPdf(Long userId, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF documents (.pdf) are permitted.");
        }

        Path userDir = rootUploadPath.resolve(String.valueOf(userId)).normalize();
        if (!userDir.startsWith(rootUploadPath)) {
            throw new SecurityException("Invalid path traversal attempted.");
        }
        Files.createDirectories(userDir);

        // Sanitize filename
        String safeBaseName = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String uniqueName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + "_" + safeBaseName;

        Path targetLocation = userDir.resolve(uniqueName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        log.info("Saved original vendor PDF invoice for user {} at {}", userId, targetLocation);
        return targetLocation.toString();
    }

    public Resource loadAsResource(String filePath) {
        try {
            Path file = Paths.get(filePath).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new IllegalArgumentException("File not found or unreadable: " + filePath);
            }
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Malformed file path: " + filePath, e);
        }
    }

    public void deleteFile(String filePath) {
        if (filePath == null || filePath.isBlank()) return;
        try {
            Path file = Paths.get(filePath).normalize();
            Files.deleteIfExists(file);
            log.info("Deleted file: {}", filePath);
        } catch (Exception e) {
            log.warn("Could not delete file {}: {}", filePath, e.getMessage());
        }
    }
}
