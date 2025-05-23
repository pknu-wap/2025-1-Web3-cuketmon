package cuketmon.oauth.Controller;

import cuketmon.oauth.util.JwtUtil;
import cuketmon.trainer.repository.TrainerRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/token")
public class RefreshTokenController {

    private final JwtUtil jwtUtil;
    private final TrainerRepository trainerRepository;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request){
        
    }

}
