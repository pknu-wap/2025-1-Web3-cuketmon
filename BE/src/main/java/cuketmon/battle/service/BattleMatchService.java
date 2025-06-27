package cuketmon.battle.service;

import cuketmon.battle.dto.BattleDTO;
import cuketmon.battle.dto.EndBattleRequest;
import cuketmon.battle.dto.EndBattleResponse;
import cuketmon.battle.dto.MatchResponse;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.battle.repository.ActiveBattles;
import cuketmon.battle.repository.WaitingQueue;
import cuketmon.battle.util.TeamMaker;
import cuketmon.trainer.service.TrainerService;
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
    private final TrainerService trainerService;

    @Autowired
    public BattleMatchService(SimpMessagingTemplate messagingTemplate, TeamMaker teamMaker,
                              WaitingQueue waitingQueue, ActiveBattles activeBattles, TrainerService trainerService) {
        this.messagingTemplate = messagingTemplate;
        this.teamMaker = teamMaker;
        this.waitingQueue = waitingQueue;
        this.activeBattles = activeBattles;
        this.trainerService = trainerService;
    }

    @Transactional
    public void findBattle(TrainerRequest request) {
        // 0. 이미 자신이 큐에 있을 때는 요청을 무시함
        if (waitingQueue.isContains(request.getTrainerName())) {
            return;
        }

        // 1. 클라이언트 큐 삽입
        waitingQueue.add(teamMaker.makeTeam(request));
        log.info("현재 대기 큐 상태  : {}", waitingQueue.getState());

        // 2. 팀 생성 (클라이언트 vs cpu)
        BattleDTO.Team red = waitingQueue.poll();
        BattleDTO.Team blue = teamMaker.makeTeam(new TrainerRequest("cpu", 1));

        // 3. 배틀 생성
        Integer battleId = generateBattleId();
        activeBattles.add(battleId, red, blue);

        log.info("배틀 생성 battleId: {}, red: {}, blue: {}", battleId, red.getTrainerName(), blue.getTrainerName());
        log.info("현재 대기 큐 상태  : {}", waitingQueue.getState());
        messagingTemplate.convertAndSend("/topic/match/" + battleId, new MatchResponse(battleId, red, blue, false));
    }

    @Transactional
    public void endBattle(Integer battleId, EndBattleRequest request) {
        BattleDTO battle = activeBattles.get(battleId);
        if (battle == null) {
            log.info("종료된 배틀 battleId:    {}", battleId);
            return;
        }

        String winner = request.getWinnerName();
        String loser = battle.getRed().getTrainerName().equals(winner) ?
                battle.getBlue().getTrainerName() : battle.getRed().getTrainerName();

        log.info("배틀 종료 요청 battleId: {}, 승자: {}", battleId, winner);
        log.info("배틀 종료 요청 battleId: {}, 패자: {}", battleId, loser);
        messagingTemplate.convertAndSend("/topic/battleEnd/" + battleId, new EndBattleResponse(winner));

        trainerService.addWin(winner);
        trainerService.addLose(loser);

        activeBattles.remove(battleId);
    }

    @Transactional
    public void cancelBattle(String trainerName) {
        // 1. 매칭 취소
        waitingQueue.remove(trainerName);
        log.info("큐 대기 취소:      {}", trainerName);
        log.info("현재 대기 큐 상태:  {}", waitingQueue.getState());

        // 2. 배틀 취소
        Integer battleId = activeBattles.getBattleIdByTrainer(trainerName);
        if (battleId != null) {
            log.info("탈주 감지 배틀 취소: {}", trainerName);
            BattleDTO battle = activeBattles.get(battleId);

            BattleDTO.Team red = battle.getRed();
            BattleDTO.Team blue = battle.getBlue();

            String winner = red.getTrainerName().equals(trainerName) ? blue.getTrainerName() : red.getTrainerName();
            endBattle(battleId, new EndBattleRequest(winner));
        }
    }

    private Integer generateBattleId() {
        return Math.abs(UUID.randomUUID().hashCode()); // UUID 생성, hashCode()로 변환, Integer 사용
    }

}
