package cuketmon.monster.controller;

import static cuketmon.constant.message.InfoMessages.FEED_SUCCESS;
import static cuketmon.constant.message.InfoMessages.NAME_CHANGE_SUCCESS;
import static cuketmon.constant.message.InfoMessages.PLAY_SUCCESS;
import static cuketmon.constant.message.InfoMessages.RELEASE_SUCCESS;

import cuketmon.monster.dto.GenerateApiRequestBody;
import cuketmon.monster.dto.NamingDTO;
import cuketmon.monster.service.MonsterService;
import cuketmon.util.SseEmitters;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/monster")
public class MonsterController {

    private final MonsterService monsterService;
    private final SseEmitters sseEmitters;

    @GetMapping("/eta")
    public Integer getETA() {
        return monsterService.getETA();
    }

    // TODO: response 이상함 고치기 우선순위는 낮음
    // 몬스터 생성
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateMonster(@AuthenticationPrincipal String trainerName,
                                                               @Validated @RequestBody GenerateApiRequestBody requestBody) {
        try {
            Integer monsterId = monsterService.generate(trainerName, requestBody);
            return ResponseEntity.ok(Map.of("monsterId", monsterId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // SSE 엔드포인트
    @GetMapping(value = "/generate/status/{monsterId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter monsterGenerationStatus(@PathVariable Integer monsterId) {
        log.info("SSE connection requested for monsterId: {}", monsterId);

        SseEmitter emitter = new SseEmitter(60 * 1000L); // 60초 타임아웃
        sseEmitters.add(monsterId, emitter);

        try {
            // 연결 확인용 초기 이벤트 전송
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data(Map.of(
                            "monsterId", monsterId,
                            "message",
                            "Connected to monster generation status"))
            );
        } catch (IOException e) {
            log.error("Failed to send initial SSE event for monsterId: {}", monsterId, e);
            emitter.completeWithError(e);
        }

        return emitter;
    }

    // 커켓몬 이름 지정
    @PatchMapping("/{monsterId}/name")
    public ResponseEntity<String> namingMonster(@AuthenticationPrincipal String trainerName,
                                                @PathVariable Integer monsterId,
                                                @Validated @RequestBody NamingDTO monsterName) {
        try {
            monsterService.naming(trainerName, monsterId, monsterName.getName());
            return ResponseEntity.ok(NAME_CHANGE_SUCCESS);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 커켓몬 놓아주기
    @DeleteMapping("/{monsterId}/release")
    public ResponseEntity<String> releaseMonster(@AuthenticationPrincipal String trainerName,
                                                 @PathVariable Integer monsterId) {
        try {
            monsterService.release(trainerName, monsterId);
            return ResponseEntity.ok(RELEASE_SUCCESS);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 먹이 주기
    @PostMapping("/{monsterId}/feed")
    public ResponseEntity<String> feedMonster(@AuthenticationPrincipal String trainerName,
                                              @PathVariable Integer monsterId) {
        try {
            monsterService.feed(trainerName, monsterId);
            return ResponseEntity.ok(FEED_SUCCESS);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 놀아 주기
    @PostMapping("/{monsterId}/play")
    public ResponseEntity<String> playWithMonster(@AuthenticationPrincipal String trainerName,
                                                  @PathVariable Integer monsterId) {
        try {
            monsterService.play(trainerName, monsterId);
            return ResponseEntity.ok(PLAY_SUCCESS);
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
