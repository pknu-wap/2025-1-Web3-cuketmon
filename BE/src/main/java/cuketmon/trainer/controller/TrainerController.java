package cuketmon.trainer.controller;

import cuketmon.trainer.dto.TrainerDTO;
import cuketmon.trainer.service.TrainerService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trainer")
public class TrainerController {

    private final TrainerService trainerService;

    @Autowired
    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    // 남은 장난감의 개수를 확인
    @GetMapping("/toys")
    public Integer getRemainingToys(@AuthenticationPrincipal String trainerName) {
        return trainerService.getRemainingToys(trainerName);
    }

    // 남은 먹이의 개수를 확인
    @GetMapping("/feeds")
    public Integer getRemainingFeeds(@AuthenticationPrincipal String trainerName) {
        return trainerService.getRemainingFeeds(trainerName);
    }

    // 랭킹 시스템
    // 개인 트레이너 개별 랭킹
    @GetMapping("/ranking")
    public ResponseEntity<?> getSingleRanking(@AuthenticationPrincipal String trainerName) {
        try {
            TrainerDTO dto = trainerService.getSingleRanking(trainerName);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("[ERROR]", e.getMessage()));
        }
    }

    // 자신의 커켓몬 보기
    @GetMapping("/monsters")
    public ResponseEntity<List<Integer>> getMyMonsterIds(@AuthenticationPrincipal String trainerName) {
        return ResponseEntity.ok(trainerService.getMonsterIds(trainerName));
    }

    // 자신의 이름 보기
    @GetMapping("/myName")
    public String getMyName(@AuthenticationPrincipal String trainerName) {
        return trainerName;
    }

}
