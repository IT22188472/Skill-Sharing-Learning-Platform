package com.flavourflow.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // Constructor to inject Cloudinary configuration
    public CloudinaryService() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dgt4osgv8",
                "api_key", "434117366716523",
                "api_secret", "V-tysOBWlzA-tv5DFY1JK-hk43k"
        ));
    }

    // Method to upload the file
    public String uploadFile(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes();  // Convert MultipartFile to byte[]
        
        // Use a typed Map for better type safety
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(fileBytes, ObjectUtils.emptyMap());
        
        // Get the URL of the uploaded file
        return (String) uploadResult.get("url");  // Return the URL of the uploaded file
    }

    public String uploadVideo(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes();
        
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(
            fileBytes,
            ObjectUtils.asMap("resource_type", "video")
        );
        
        return (String) uploadResult.get("url");
    }
    
}
