package com.flavorflow.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {

    // Your Cloudinary credentials (replace with your own)
    private final String cloudName = "dgt4osgv8"; 
    private final String apiKey = "434117366716523";
    private final String apiSecret = "V-tysOBWlzA-tv5DFY1JK-hk43k";

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret
        ));
    }
}


