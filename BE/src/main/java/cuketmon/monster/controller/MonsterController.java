package cuketmon.monster.controller;

import cuketmon.monster.dto.GenerateApiRequestBody;
import cuketmon.monster.dto.NamingDTO;
import cuketmon.monster.service.MonsterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", methods = RequestMethod.POST)
@Validated
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
    public ResponseEntity<Integer> generateMonster(@Validated @RequestBody GenerateApiRequestBody requestBody) {
        Integer monsterId = monsterService.generate(requestBody);
        return ResponseEntity.ok(monsterId);
    }

    // 커켓몬 이름 지정
    @PatchMapping("/{monsterId}/name")
    public ResponseEntity<String> namingMonster(@PathVariable Integer monsterId,
                                                @Validated @RequestBody NamingDTO monsterName) {
        try {
            monsterService.naming(monsterId, monsterName.getName());
            return ResponseEntity.ok("커켓몬 이름 변경 성공!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{monsterId}/release")
    public ResponseEntity<String> releaseMonster(@PathVariable Integer monsterId) {
        try {
            monsterService.release(monsterId);
            return ResponseEntity.ok("커켓몬 놓아주기 성공!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 먹이 주기
    @PostMapping("/{monsterId}/feed")
    public ResponseEntity<String> feedMonster(@PathVariable Integer monsterId) {
        try {
            monsterService.feed(monsterId);
            return ResponseEntity.ok("먹이를 주었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 놀아 주기
    @PostMapping("/{monsterId}/play")
    public ResponseEntity<String> playWithMonster(@PathVariable Integer monsterId) {
        try {
            monsterService.play(monsterId);
            return ResponseEntity.ok("놀아주었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 마이페이지 커켓몬 정보 조회
    @GetMapping("/{monsterId}/info")
    public ResponseEntity<?> getMonsterInfo(@PathVariable Integer monsterId) {
        try {
            return ResponseEntity.ok(monsterService.getMonsterInfo(monsterId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 배틀페이지 커켓몬 정보 조회
    @GetMapping("/{monsterId}/battleInfo")
    public ResponseEntity<?> getMonsterBattleInfo(@PathVariable Integer monsterId) {
        try {
            return ResponseEntity.ok(monsterService.getMonsterBattleInfo(monsterId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
