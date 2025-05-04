package cuketmon.trainer.controller;

import cuketmon.trainer.dto.TrainerDTO;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.service.TrainerService;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    //
    @GetMapping("/ranking")
    public ResponseEntity<List<TrainerDTO>> getTrainerRanking() {
        return ResponseEntity.ok(trainerService.getTrainerRanking());
    }

    // 남은 장난감의 개수를 확인
    @GetMapping("/{trainerName}/toys")
    public Integer getRemainingToys_(@PathVariable String trainerName) {
        return trainerService.getRemainingToys(trainerName);
    }

    // 남은 먹이의 개수를 확인
    @GetMapping("/{trainerName}/feeds")
    public Integer getRemainingFeeds_(@PathVariable String trainerName) {
        return trainerService.getRemainingFeeds(trainerName);
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

}
