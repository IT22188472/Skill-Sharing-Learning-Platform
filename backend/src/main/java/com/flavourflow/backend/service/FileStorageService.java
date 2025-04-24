package com.flavourflow.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final long MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

    // Save image files to the upload directory
    public String saveImage(MultipartFile file) {
        return saveFile(file, "images", MAX_IMAGE_SIZE);
    }

    // Save video files to the upload directory
    public String saveVideo(MultipartFile file) {
        return saveFile(file, "videos", MAX_VIDEO_SIZE);
    }

    // Save the file and return its URL
    private String saveFile(MultipartFile file, String type, long maxSize) {
        // Validate file size
        if (file.getSize() > maxSize) {
            throw new RuntimeException("File size exceeds the maximum allowed limit of " + (maxSize / (1024 * 1024)) + "MB");
        }

        try {
            // Generate a unique filename
            String filename = UUID.randomUUID() + getExtension(file.getOriginalFilename());
            
            // Define the upload path based on file type (images or videos)
            Path uploadPath = Paths.get(uploadDir, type);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);  // Create directories if they do not exist
            }

            // Define the target location for the file
            Path targetLocation = uploadPath.resolve(filename);

            // Copy the file to the target location
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Return the URL of the uploaded file
            return "/uploads/" + type + "/" + filename;

        } catch (IOException e) {
            throw new RuntimeException("Could not store file. Error: " + e.getMessage(), e);
        }
    }

    // Get file extension from the original filename
    private String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf("."));
    }
}
