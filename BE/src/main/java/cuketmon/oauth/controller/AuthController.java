package cuketmon.oauth.controller;

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
public class AuthController {
    private final JwtUtil jwtUtil;
    private final TrainerRepository trainerRepository;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request)
    {

        String refreshToken = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(cookie -> cookie.getName().equals("refresh_token"))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body("Invalid or missing refresh token");
        }

        String trainerName = jwtUtil.getTrainerNameFromToken(refreshToken);

        String savedToken = String.valueOf(trainerRepository.findrefreshTokenByTrainerName(trainerName));
        if (!refreshToken.equals(savedToken)) {
            return ResponseEntity.status(401).body("Refresh token mismatch");
        }

        String newAccessToken = jwtUtil.createAccessToken(trainerName);

        return ResponseEntity.ok().body(newAccessToken);
    }
}
