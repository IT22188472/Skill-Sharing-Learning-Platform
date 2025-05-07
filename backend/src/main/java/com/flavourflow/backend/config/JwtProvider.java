package com.flavourflow.backend.config;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.ArrayList;

import javax.crypto.SecretKey;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtProvider {

    private static final SecretKey key=Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    public static String generateToken(Authentication auth){

        Instant now = Instant.now();
        Instant expiry = now.plus(1, ChronoUnit.DAYS);


        String jwt = Jwts.builder()
                .issuer("Flavourflow")                            
                .issuedAt(Date.from(now))                         
                .expiration(Date.from(expiry))                    
                .claim("email", auth.getName())
                .signWith(key)
                .compact();

        return jwt;
    }

    public static String getEmailFromJwtToken(String jwt) {
        // Remove Bearer prefix if present
        if (jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }
        
        try {
            System.out.println("Parsing JWT token: " + jwt.substring(0, Math.min(jwt.length(), 20)) + "...");
            JwtParser parser = Jwts.parser().verifyWith(key).build();
            Claims claims = parser.parseSignedClaims(jwt).getPayload();
            String email = claims.get("email", String.class);
            System.out.println("Extracted email: " + email);
            return email;
        } catch (JwtException e) {
            System.err.println("JWT validation error: " + e.getMessage());
            throw new RuntimeException("Invalid or expired JWT token", e);
        }    
    }

    public static Authentication getAuthentication(String jwt) {
        jwt = jwt.substring(7);
        
        try {
            JwtParser parser = Jwts.parser().verifyWith(key).build();
            Claims claims = parser.parseSignedClaims(jwt).getPayload();
            String email = claims.get("email", String.class);
            
            return new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    
}
