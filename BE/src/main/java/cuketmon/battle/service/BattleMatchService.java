package cuketmon.battle.service;

import cuketmon.battle.dto.MatchResponse;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.UUID;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BattleMatchService {

    private final SimpMessagingTemplate messagingTemplate;
    private final Queue<String> waitingQueue = new LinkedList<>();
    private final Map<String, Integer> activeBattles = new HashMap<>();

    public BattleMatchService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public void findBattle(String trainerName) {
        if (waitingQueue.isEmpty()) {
            waitingQueue.add(trainerName);
            return;
        }

        String opponent = waitingQueue.poll();
        Integer battleId = generateBattleId(); // 배틀 ID 생성

        activeBattles.put(trainerName, battleId);
        activeBattles.put(opponent, battleId);

        System.out.println("매칭된 배틀 생성: battleId=" + battleId + ", trainer1=" + trainerName + ", trainer2=" + opponent);

        // 매칭된 트레이너들에게 배틀 시작 알림
        messagingTemplate.convertAndSend("/topic/match/" + battleId,
                new MatchResponse(battleId, trainerName, opponent));
    }

    private Integer generateBattleId() {
        return Math.abs(UUID.randomUUID().hashCode()); // UUID 생성, hashCode()로 변환, Integer 사용
    }

}
