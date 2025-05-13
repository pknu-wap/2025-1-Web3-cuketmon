package cuketmon.battle.service;

import cuketmon.battle.constant.BattleStatus;
import cuketmon.battle.dto.BattleDTO;
import cuketmon.battle.dto.EndBattleResponse;
import cuketmon.battle.dto.MatchResponse;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.battle.repository.ActiveBattles;
import cuketmon.battle.repository.WaitingQueue;
import cuketmon.battle.util.TeamMaker;
import cuketmon.util.CustomLogger;
import java.util.UUID;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BattleMatchService {

    private static final Logger log = CustomLogger.getLogger(BattleMatchService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final TeamMaker teamMaker;

    private final WaitingQueue waitingQueue;
    private final ActiveBattles activeBattles;

    @Autowired
    public BattleMatchService(SimpMessagingTemplate messagingTemplate,
                              TeamMaker teamMaker, WaitingQueue waitingQueue, ActiveBattles activeBattles) {
        this.messagingTemplate = messagingTemplate;
        this.teamMaker = teamMaker;
        this.waitingQueue = waitingQueue;
        this.activeBattles = activeBattles;
    }

    @Transactional
    public void findBattle(TrainerRequest request) {
        // 0. 이미 자신이 큐에 있을 때는 요청을 무시함
        if (waitingQueue.isContains(request.getTrainerName())) {
            return;
        }

        // 1. 큐 대기
        if (waitingQueue.isEmpty()) {
            waitingQueue.add(teamMaker.makeTeam(request));
            return;
        }

        // 2. 팀 생성
        BattleDTO.Team red = waitingQueue.poll();
        BattleDTO.Team blue = teamMaker.makeTeam(request);

        // 3. 선공 설정
        if (red.getMonster().getSpeed() > blue.getMonster().getSpeed()) {
            red.changeTurn();
        } else {
            blue.changeTurn();
        }

        // 4. 배틀 생성
        Integer battleId = generateBattleId();
        activeBattles.add(battleId, red, blue);

        log.info("배틀 생성 battleId: {}, red: {}, blue: {}", battleId, red.getTrainerName(), blue.getTrainerName());
        log.info("현재 대기 큐 상태: {}", waitingQueue.getState());
        messagingTemplate.convertAndSend("/topic/match/" + battleId, new MatchResponse(battleId, blue, red));
    }

    @Transactional
    public void endBattle(Integer battleId) {
        log.info("배틀 종료 요청 battleId: {}", battleId);
        messagingTemplate.convertAndSend("/topic/battleEnd/" + battleId,
                new EndBattleResponse(battleId, BattleStatus.FINISHED.getName()));
    }

    @Transactional
    public void removeFromQueue(String trainerName) {
        waitingQueue.remove(trainerName);
        log.info("큐 대기 취소: {}", trainerName);
    }

    private Integer generateBattleId() {
        return Math.abs(UUID.randomUUID().hashCode()); // UUID 생성, hashCode()로 변환, Integer 사용
    }

}
