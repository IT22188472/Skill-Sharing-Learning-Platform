package com.flavorflow.backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    // Your Cloudinary credentials (replace with your own)
    private String cloudName = "dgt4osgv8"; 
    private String apiKey = "434117366716523";
    private String apiSecret = "V-tysOBWlzA-tv5DFY1JK-hk43k";

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret
        ));
    }
}


