package cuketmon.trainer.controller;

import cuketmon.trainer.dto.TrainerDTO;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.service.TrainerService;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import jakarta.persistence.PostRemove;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainer")
public class TrainerController {

    private final TrainerService trainerService;

    @Autowired
    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
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



    // 랭킹 시스템
    //전체 트레이너 랭킹
//    @GetMapping("/ranking")
//    public ResponseEntity<List<TrainerDTO>> getTrainerRanking() {
//        return ResponseEntity.ok(trainerService.getTrainerRanking());
//    }

    @PostMapping("/ranking")
    public ResponseEntity<List<TrainerDTO>> getTrainerRanking(@RequestBody TrainerDTO request){
        return ResponseEntity.ok(trainerService.getTrainerRanking());
    }

    //개인 트레이너 개별 랭킹
//    @GetMapping("/raking/{trainerName}")
//    public ResponseEntity<?> getSingleRanking(@PathVariable String trainerName) {
//        try{
//            TrainerDTO dto = trainerService.getSingleRanking(trainerName);
//            return ResponseEntity.ok(dto);
//        } catch (NoSuchElementException e) {
//            return ResponseEntity.status(404).body(Map.of("[ERROR]", e.getMessage()));
//        }
//    }

    @PostMapping("/ranking/{trainerName}")
    public ResponseEntity<?> getSingleRanking(@RequestBody TrainerDTO request) {
        try {
            String trainerName = request.getTrainerName ();
            TrainerDTO dto = trainerService.getSingleRanking(trainerName);
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("[ERROR]", e.getMessage()));
        }
    }

}
