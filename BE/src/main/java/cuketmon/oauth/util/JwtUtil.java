package cuketmon.oauth.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    // 만약 실제로 release 한다면 보안 강도가 더 높은 키로 변경
    @Value("${jwt.secret.key}")
    private String secretKey; //토큰 키

    // 2분
    private final long accessTokenexpirationMs = 1000 * 60  * 2;
    //refreshToken 3시간
    private final long refreshTokenexpirationMs = 1000 * 60 * 60 * 3;

    public String createAccessToken(String trainerName) {
        return generateToken(trainerName, accessTokenexpirationMs);
    }

    public String createRefreshToken(String trainerName) {
        return generateToken(trainerName, refreshTokenexpirationMs);
    }

    //토큰 키 생성
//    public String createAccessToken(String trainerName) {
//        Date now = new Date();
//        Date expiry = new Date(now.getTime() + accessTokenexpirationMs);
//
//        return Jwts.builder()
//                .setSubject(trainerName)
//                .setIssuedAt(now)
//                .setExpiration(expiry)
//                .signWith(SignatureAlgorithm.HS256, secretKey)
//                .compact();
//    }

    private String generateToken(String trainerName, long expirationTime){
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setSubject(trainerName)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    //유효성
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    public String getTrainerNameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

}
