package cuketmon.monster.service;

import cuketmon.monster.entity.Monster;
import cuketmon.monster.repository.MonsterRepository;
import cuketmon.util.SseEmitters;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MonsterGenerationScheduler {

    private final MonsterRepository monsterRepository;
    private final SseEmitters sseEmitters;

    @Scheduled(fixedDelay = 3000) // 3초마다 체크
    public void checkMonsterGeneration() {
        try {
            // 현재 대기중인 모든 monsterId들 확인
            Set<Integer> waitingMonsterIds = sseEmitters.getWaitingMonsterIds();

            // 대기중인 SSE 연결이 없으면 체크 스킵
            if (waitingMonsterIds.isEmpty()) {
                return;
            }

            for (Integer monsterId : waitingMonsterIds) {
                // 해당 monsterId의 image가 null이 아닌지 확인
                Optional<Monster> monster = monsterRepository.findById(monsterId);

                if (monster.isPresent() && monster.get().getImage() != null) {
                    log.info("Monster generation completed for monsterId: {}", monsterId);

                    // SSE로 완료 알림 전송
                    Map<String, Object> completionData = Map.of(
                            "monsterId", monsterId,
                            "message", "Monster generation completed",
                            "timestamp", LocalDateTime.now()
                    );

                    sseEmitters.sendToMonster(monsterId, "completed", completionData);
                }
            }
        } catch (Exception e) {
            log.error("Error occurred while checking monster generation", e);
        }
    }

}
