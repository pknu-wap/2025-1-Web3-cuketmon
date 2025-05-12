package cuketmon.oauth.service;

import cuketmon.oauth.util.JwtUtil;
import jakarta.servlet.ServletException;
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

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String trainerName = oAuth2User.getName();

        // JWT 발급
        String accessToken = jwtUtil.createToken(trainerName);
        String redirectUri = (String) request.getSession().getAttribute("redirect_uri");

        if (redirectUri == null || redirectUri.isBlank()) {
            redirectUri = CLIENT_URL + "/make"; // fallback
        }

        String finalRedirect = redirectUri + (redirectUri.contains("?") ? "&" : "?") + "token=" + accessToken;
        response.sendRedirect(finalRedirect);
    }

}
