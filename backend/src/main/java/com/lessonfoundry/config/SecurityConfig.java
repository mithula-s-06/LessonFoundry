package com.lessonfoundry.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)) // For H2 console
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/ai/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                
                // Student & shared read endpoints
                .requestMatchers("/api/packs/student/**").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/packs/*").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/assets/*").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                
                // Teacher operations
                .requestMatchers("/api/sources/**").hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers("/api/packs/**").hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers("/api/assets/**").hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers("/api/validation/**").hasAnyRole("TEACHER", "ADMIN")
                
                // User Profile (Shared by all roles)
                .requestMatchers("/api/users/profile").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                
                // Admin operations
                .requestMatchers("/api/admin", "/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/users", "/api/users/**", "/api/users/*").hasRole("ADMIN")
                .requestMatchers("/api/audit", "/api/audit/**").hasAnyRole("ADMIN", "TEACHER")
                
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
