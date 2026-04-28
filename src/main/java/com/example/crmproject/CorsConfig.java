package com.example.crmproject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    private final String[] allowedOrigins;
    private final String[] allowedOriginPatterns;

    public CorsConfig(
            @Value("${app.cors.allowed-origins:http://localhost:5173}") String allowedOrigins,
            @Value("${app.cors.allowed-origin-patterns:https://*.up.railway.app}") String allowedOriginPatterns
    ) {
        this.allowedOrigins = parseCsv(allowedOrigins);
        this.allowedOriginPatterns = parseCsv(allowedOriginPatterns);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        CorsRegistration registration = registry.addMapping("/api/**")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);

        if (allowedOrigins.length > 0) {
            registration.allowedOrigins(allowedOrigins);
        }

        if (allowedOriginPatterns.length > 0) {
            registration.allowedOriginPatterns(allowedOriginPatterns);
        }
    }

    private static String[] parseCsv(String value) {
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toArray(String[]::new);
    }
}
