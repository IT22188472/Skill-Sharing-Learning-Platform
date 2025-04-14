package com.flavourflow.backend.config;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import javax.crypto.SecretKey;

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
        //Bearer token
        jwt=jwt.substring(7);
        

    try {

        JwtParser parser = Jwts.parser().verifyWith(key).build();
        Claims claims = parser.parseSignedClaims(jwt).getPayload();
        return claims.get("email", String.class);

    } catch (JwtException e) {
        throw new RuntimeException("Invalid or expired JWT token", e);
    }    
    }

    
}
