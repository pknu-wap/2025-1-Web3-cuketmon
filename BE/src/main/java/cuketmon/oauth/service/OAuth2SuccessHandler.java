package cuketmon.oauth.service;

import cuketmon.oauth.util.JwtUtil;
import cuketmon.trainer.repository.TrainerRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${client.redirect-url}")
    private String CLIENT_URL;
    private final JwtUtil jwtUtil;
    private final TrainerRepository trainerRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String trainerName = oAuth2User.getName();

        // tokens 생성
        String accessToken = jwtUtil.createAccessToken(trainerName);
        String refreshToken = jwtUtil.createRefreshToken(trainerName);

        // 쿠키 생성과 전달
        response.setHeader("Set-Cookie",
                "refresh_token=" + refreshToken +
                        "; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=" + (60 * 60 * 24 * 3));

        trainerRepository.updateRefreshToken(trainerName, refreshToken);

        // JWT를 프론트에 리다이렉트하며 전달
        response.sendRedirect(CLIENT_URL + "/loginSuccess/?token=" + accessToken);
    }

}