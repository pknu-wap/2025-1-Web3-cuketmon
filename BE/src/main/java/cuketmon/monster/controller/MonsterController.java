package cuketmon.monster.controller;

import cuketmon.monster.dto.GenerateApiRequestBody;
import cuketmon.monster.dto.NamingDTO;
import cuketmon.monster.service.MonsterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
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
    // TODO: 커켓몬 아이디 반환하기
    //  이후의 api는 id 를 사용하도록
    @PostMapping("/generate")
    public ResponseEntity<String> generateMonster(@Valid @RequestBody GenerateApiRequestBody requestBody) {
        monsterService.tempGenerate(requestBody);
        return ResponseEntity.ok("커켓몬 생성 성공!");
    }

    // 커켓몬 이름 지정
    @PatchMapping("/{monsterId}/name")
    public ResponseEntity<String> namingMonster(@PathVariable Integer monsterId, @RequestBody NamingDTO monsterName) {
        monsterService.namingMonster(monsterId, monsterName.getName());
        return ResponseEntity.ok("커켓몬 이름 변경 성공!");
    }

    // 먹이 주기
    @PostMapping("/{monsterId}/feed")
    public ResponseEntity<String> feedMonster(@PathVariable Integer monsterId) {
        try {
            monsterService.feedMonster(monsterId);
            return ResponseEntity.ok("먹이를 주었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage() + " 먹이를 줄 수 없습니다.");
        }
    }

    // 놀아 주기
    @PostMapping("/{monsterId}/play")
    public ResponseEntity<String> playWithMonster(@PathVariable Integer monsterId) {
        try {
            monsterService.playWithMonster(monsterId);
            return ResponseEntity.ok("놀아주었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage() + " 놀아 줄 수 없습니다.");
        }
    }

}
