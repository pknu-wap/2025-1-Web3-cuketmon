package cuketmon.battle.controller;

import cuketmon.battle.service.BattleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/battle")
public class BattleController {

    private final BattleService battleService;

    @Autowired
    public BattleController(BattleService battleService) {
        this.battleService = battleService;
    }

    // 배틀 시작 기능
    @PostMapping("/start")
    public ResponseEntity<Integer> startBattle(@RequestParam String trainer1Name, @RequestParam String trainer2Name) {
        try {
            Integer battleId = battleService.startBattle(trainer1Name, trainer2Name);
            return ResponseEntity.ok(battleId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // 배틀 종료 기능
    @PostMapping("/end/{battleId}")
    public ResponseEntity<String> endBattle(@PathVariable Integer battleId) {
        try {
            battleService.endBattle(battleId);
            return ResponseEntity.ok("배틀 종료!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
