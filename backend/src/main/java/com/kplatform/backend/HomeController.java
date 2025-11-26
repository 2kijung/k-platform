package com.kplatform.backend;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("s")
    public String home() {
        return "서버 연결 성공";
    }
}