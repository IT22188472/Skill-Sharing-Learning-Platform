package com.flavourflow.backend.config;

import java.io.IOException;
import java.util.List;

import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class jwtValidator extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        if (request.getMethod().equals("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_OK);
            filterChain.doFilter(request, response);
            return;
        }
        
        String jwt = request.getHeader(JwtConstant.JWT_HEADER);
        
        if (jwt != null && jwt.startsWith("Bearer ")) {
            try {
                Authentication authentication = JwtProvider.getAuthentication(jwt);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                logger.error("JWT token validation failed: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        List<String> excludedPaths = List.of("/api/auth/signin", "/api/auth/signup", "/auth/signin", "/auth/signup", "/swagger-ui", "/v3/api-docs", "/uploads/");
        String path = request.getServletPath();
        
        // For GET requests, don't filter /api/posts/* and /api/groups/* paths
        if (request.getMethod().equals("GET") && (path.startsWith("/api/posts/") || path.startsWith("/api/groups") || path.equals("/api/posts") || path.equals("/api/groups"))) {
            return true;
        }
        
        return excludedPaths.stream().anyMatch(path::startsWith);
    }
}
