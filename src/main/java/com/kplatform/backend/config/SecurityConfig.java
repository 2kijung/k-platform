package com.kplatform.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ✅ CSRF 완전 비활성화
                .csrf(csrf -> csrf.disable())

                // ✅ 요청별 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 회원가입, 로그인은 모두 접근 허용
                        .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                        // 그 외는 인증 필요
                        .anyRequest().authenticated()
                )

                // ✅ 로그인폼, Basic Auth 등 끄기 (단순 REST API라면)
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
