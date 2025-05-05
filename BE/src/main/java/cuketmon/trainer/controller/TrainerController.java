package cuketmon.trainer.controller;

import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.service.TrainerService;
import java.util.List;
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

    // 랭킹 시스템
    @GetMapping("/ranking")
    public ResponseEntity<List<Trainer>> getTrainerRanking() {
        return ResponseEntity.ok(trainerService.getTop5TrainersByWin());
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

    // 자신의 커켓몬 보기
    @GetMapping("/monsters")
    public ResponseEntity<List<Integer>> getMyMonsterIds(@AuthenticationPrincipal String trainerName) {
        return ResponseEntity.ok(trainerService.getMonsterIds(trainerName));
    }

}
