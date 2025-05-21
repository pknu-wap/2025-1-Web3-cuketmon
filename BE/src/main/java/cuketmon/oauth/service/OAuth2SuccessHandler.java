package cuketmon.oauth.service;

import cuketmon.oauth.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import jakarta.servlet.http.Cookie;
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

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String trainerName = oAuth2User.getName();

        // JWT 생성
        String accessToken = jwtUtil.createAccessToken(trainerName);
        String refreshToken = jwtUtil.createRefreshToken(trainerName);

        // TODO: 이거 안됨 ;
        // 로컬/배포 환경에 맞춰 redirect 가능
        String state = request.getParameter("state");

        //쿠키 생성과 전달
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60*60*24*7);
        response.addCookie(cookie);

        // JWT를 프론트에 리다이렉트하며 전달
        if ("local".equals(state)) {
            response.sendRedirect("http://localhost:3000/make/?token=" + accessToken);
        } else {
            response.sendRedirect(CLIENT_URL + "/make/?token=" + accessToken);
        }
    }

}