package cuketmon.oauth.service;

import cuketmon.oauth.util.JwtUtil;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final TrainerRepository trainerRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // 1. Authorization 헤더 확인
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // "Bearer " 이후 토큰만 추출

            try {
                // 2. 토큰 유효성 검증
                if (!jwtUtil.validateToken(token)) {
                    log.debug("[DEBUG] JWT validation failed");
                    filterChain.doFilter(request, response);
                    return;
                }

                // 3. 토큰에서 사용자 이름 추출
                String trainerName = jwtUtil.getTrainerNameFromToken(token);

                // 4. 사용자 정보 조회
                Trainer trainer = trainerRepository.findById(trainerName).orElse(null);
                if (trainer != null) {
                    // 5. 인증 객체 생성
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            trainer.getName(),  // 로그인한 사용자 Id (이후 @AuthenticationPrincipal 등에서 사용)
                            null,               // 비밀번호 정보(우리는 JWT 로그인이라 생략)
                            List.of(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // 유효하지 않은 토큰이면 무시하고 다음 필터로 넘어감
                log.warn("[WARN ] JWT processing failed", e);
            }
        }

        filterChain.doFilter(request, response);
    }

}
