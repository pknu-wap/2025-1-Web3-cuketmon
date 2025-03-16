package cuketmon.trainer.controller;

import cuketmon.trainer.service.TrainerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/trainer")
public class TrainerController {

    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    // 임시 로그인 기능
    //Kakao Api


    @PostMapping("tempLogin")
    public ResponseEntity<String> login(@RequestParam String name) {
        trainerService.tempLogin(name);
        return ResponseEntity.ok("로그인 성공, 사용자 이름: " + name);
    }

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
