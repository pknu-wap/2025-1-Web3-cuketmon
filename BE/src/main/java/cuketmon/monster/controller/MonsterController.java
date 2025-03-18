package cuketmon.monster.controller;

import cuketmon.monster.dto.GenerateApiRequestBody;
import cuketmon.monster.service.MonsterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/monster")
public class MonsterController {

    private final MonsterService monsterService;

    @Autowired
    public MonsterController(MonsterService monsterService) {
        this.monsterService = monsterService;
    }

    // 임시 몬스터 생성 기능
    @PostMapping("/generate")
    public ResponseEntity<String> generateMonster(@Valid @RequestBody GenerateApiRequestBody requestBody) {
        monsterService.tempGenerate(requestBody);
        return ResponseEntity.ok("커켓몬 생성 성공!");
    }

    // 먹이 주기
    @PostMapping("/{monsterName}/feed")
    public ResponseEntity<String> feedMonster(@PathVariable String monsterName) {
        try {
            monsterService.feedMonster(monsterName);
            return ResponseEntity.ok("먹이를 주었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage() + " 먹이를 줄 수 없습니다.");
        }
    }

    // 놀아 주기
    @PostMapping("/{monsterName}/play")
    public ResponseEntity<String> playWithMonster(@PathVariable String monsterName) {
        try {
            monsterService.playWithMonster(monsterName);
            return ResponseEntity.ok("커켓몬과 놀아주었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage() + " 놀아 줄 수 없습니다.");
        }
    }

}
