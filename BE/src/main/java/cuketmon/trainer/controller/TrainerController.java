package cuketmon.trainer.controller;

import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import cuketmon.trainer.service.TrainerService;

import ch.qos.logback.core.model.Model;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.Getter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springdoc.core.configuration.oauth2.SpringDocOAuth2Token;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;



import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


//Kakao Login

@Getter
@RestController
@RequestMapping("/trainers")
@RequiredArgsConstructor

//@ConfigurationProperties(prefix = "kakao")
public class TrainerController {

    private final TrainerRepository trainerRepository;
    private final TrainerService trainerService;
    private final RestTemplate restTemplate = new RestTemplate();

    private static String clientId;
    private static String redirectUri;
    //private  static String code;
    private  static String clientSecret;

    @GetMapping("/ranking")
    public ResponseEntity<List<Trainer>> getTrainerRanking() {
        List<Trainer> ranking = trainerService.getTrainerRanking();
        return ResponseEntity.ok(ranking);
    }

    //현재 랭킹 조회
    @GetMapping("/{trainerName}/ranking")
    public ResponseEntity<Integer> getTrainerRank(@PathVariable String trainerName) {
        int rank = trainerService.getTrainerRank(trainerName);
        return ResponseEntity.ok(rank);
    }

    @Autowired
    public TrainerController(TrainerRepository trainerRepository, TrainerRepository trainerRepository2) {

        this.trainerRepository = trainerRepository;
        //TrainerRepository = trainerRepository2;
        trainerService = null;
    }


    @Value("${kakao.client_id}")
    private String client_id;

    @Value("${kakao.redirect_uri}")
    private String redirect_uri;

    @Value("${kakao.client_secret:}")
    private String client_secret;

    @GetMapping("/page")
    public Map<String, String> loginPage() {
        String location = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=xxx&redirect_uri=xxx";
        Map<String, String> response = new HashMap<>();
        response.put("location", location);
        return response;
    }

    @PostConstruct
    private void init() {
        if (clientId == null || redirectUri == null || clientSecret == null) {
            throw new IllegalArgumentException("Kakao API 설정 오류");
        }
        if (clientId.isEmpty() || redirectUri.isEmpty() || clientSecret.isEmpty()) {
            throw new IllegalArgumentException("Kakao API 설정 오류: 환경 변수 확인 필요");
        }
    }

    @GetMapping("/loginFailure")
    public String loginFailure() {
        return "failure";  // failure.html
    }

    //private final TrainerService trainerService;
    //public TrainerController(TrainerService trainerService) { this.trainerService = trainerService;}

    @Transactional
    @PostMapping("/callback")
    public ResponseEntity<String> kakaoLogin(@RequestParam("code") String code) {
        // 1. 액세스 토큰 요청
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, String> params = new HashMap<>();
        params.put("grant_type", "authorization_code");
        params.put("client_id", clientId);
        params.put("redirect_uri", redirectUri);
        params.put("code", code);
        params.put("client_secret", clientSecret);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://kauth.kakao.com/oauth/token", request, Map.class);

        String accessToken = (String) response.getBody().get("access_token");

        // 2. 사용자 정보 요청
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.add("Authorization", "Bearer " + accessToken);
        HttpEntity<String> userInfoRequest = new HttpEntity<>(userInfoHeaders);

        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me", HttpMethod.GET, userInfoRequest, Map.class);

        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfoResponse.getBody().get("kakao_account");
        String email = (String) kakaoAccount.get("email");
        String name = (String) kakaoAccount.get("name");

        //return ResponseEntity.ok("로그인 성공 , 사용자 이름: " + email);
        return ResponseEntity.ok("로그인 성공 , 사용자 이름: " + name);

    }

    //kakaoAPI kakaoApi = new kakaoAPI();

    // 임시 로그인 기능
    //@PostMapping("tempLogin")
    //public ResponseEntity<String> login(@RequestParam String name) {
    //    trainerService.tempLogin(name);
    //    return ResponseEntity.ok("로그인 성공, 사용자 이름: " + name);
    //}

    // 남은 장난감의 개수를 확인
    @GetMapping("/{trainerName}/toys")
    public Integer getRemainingToys(@PathVariable String trainerName) {
        return trainerService.getRemainingToys(trainerName);
    }

    // 남은 먹이의 개수를 확인
    @GetMapping("/{trainerName}/feeds")
    public Integer getRemainingFeeds(@PathVariable String trainerName) {
        return trainerService.getRemainingFeeds(trainerName);
    }

}
