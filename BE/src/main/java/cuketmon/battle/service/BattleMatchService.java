package cuketmon.battle.service;

import static cuketmon.util.Damage.makeDamage;

import cuketmon.battle.constant.BattleStatus;
import cuketmon.battle.dto.BattleDTO;
import cuketmon.battle.dto.EndBattleResponse;
import cuketmon.battle.dto.ErrorResponse;
import cuketmon.battle.dto.MatchResponse;
import cuketmon.battle.dto.SkillRequest;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.battle.util.TeamMaker;
import cuketmon.monster.dto.MonsterDTO;
import cuketmon.monster.dto.MonsterDTO.MonsterBattleInfo;
import cuketmon.trainer.service.TrainerService;
import cuketmon.util.CustomLogger;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
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
    private final TrainerService trainerService;
    private final TeamMaker teamMaker;

    private final Queue<BattleDTO.Team> waitingQueue = new LinkedList<>();
    private final Map<Integer, BattleDTO> activeBattles = new HashMap<>();

    @Autowired
    public BattleMatchService(SimpMessagingTemplate messagingTemplate,
                              TrainerService trainerService, TeamMaker teamMaker) {
        this.messagingTemplate = messagingTemplate;
        this.trainerService = trainerService;
        this.teamMaker = teamMaker;
    }

    @Transactional
    public void findBattle(TrainerRequest request) {
        // 0. 이미 자신이 큐에 있을 때는 요청을 무시함
        if (waitingQueue.stream().anyMatch(team -> team.getTrainerName().equals(request.getTrainerName()))) {
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
        activeBattles.put(battleId, new BattleDTO(red, blue));

        log.info("배틀 생성 battleId: {}, red: {}, blue: {}", battleId, red.getTrainerName(), blue.getTrainerName());
        log.info("현재 대기 큐 상태: {}", waitingQueue.stream()
                .map(BattleDTO.Team::getTrainerName)
                .toList());
        messagingTemplate.convertAndSend("/topic/match/" + battleId, new MatchResponse(battleId, blue, red));
    }

    @Transactional
    public void endBattle(Integer battleId) {
        log.info("배틀 종료 요청 battleId: {}", battleId);
        messagingTemplate.convertAndSend("/topic/battleEnd/" + battleId,
                new EndBattleResponse(battleId, BattleStatus.FINISHED.getName()));
    }

    // TODO: 클래스 기능 분리하기
    //  matchService에는 match만 관리하도록!
    @Transactional
    public void useSkill(Integer battleId, SkillRequest skillRequest) {
        String turnDestination = "/topic/battle/" + battleId;

        // 1. 배틀 확인
        BattleDTO battle = activeBattles.get(battleId);
        if (battle == null) {
            messagingTemplate.convertAndSend(turnDestination, new ErrorResponse("해당 배틀을 찾을 수 없습니다."));
            return;
        }
        BattleDTO.Team red = battle.getRed();
        BattleDTO.Team blue = battle.getBlue();

        // 2. 공격자 방어자 구분
        BattleDTO.Team attacker;
        BattleDTO.Team defender;
        if (battle.getRed().getTrainerName().equals(skillRequest.getTrainerName())) {
            attacker = red;
            defender = blue;
        } else if (battle.getBlue().getTrainerName().equals(skillRequest.getTrainerName())) {
            attacker = blue;
            defender = red;
        } else {
            messagingTemplate.convertAndSend(turnDestination, new ErrorResponse("트레이너를 찾을 수 없습니다."));
            return;
        }

        // 3. 공격자 턴 검증
        if (!attacker.getTurn()) {
            messagingTemplate.convertAndSend(turnDestination, new ErrorResponse("상대의 턴 입니다."));
            return;
        }

        MonsterDTO.MonsterBattleInfo attackerMonster = attacker.getMonster();
        MonsterDTO.MonsterBattleInfo defenderMonster = defender.getMonster();

        // 4. 공격 스킬 선택
        List<MonsterBattleInfo.Skill> skills = attacker.getMonster().getSkills();

        int skillNumber = skillRequest.getSkillId();
        if (skillNumber < 0 || skillNumber >= skills.size()) {
            messagingTemplate.convertAndSend(turnDestination, new ErrorResponse("잘못된 스킬 번호입니다."));
            return;
        }
        MonsterDTO.MonsterBattleInfo.Skill usedSkill = skills.get(skillNumber);

        // 6. PP 확인 및 차감
        if (usedSkill.getPp() <= 0) {
            messagingTemplate.convertAndSend(turnDestination, new ErrorResponse("PP가 부족합니다."));
            return;
        }
        usedSkill.usePp(1);

        // 7. 데미지 계산 
        int damage = (int) makeDamage(attackerMonster, defenderMonster, usedSkill);

        // 8. 방어자 몬스터 HP 갱신
        defenderMonster.applyDamage(damage);
        if (defenderMonster.getHp() <= 0) {
            messagingTemplate.convertAndSend("/topic/battleEnd/" + battleId, new MatchResponse(battleId, red, blue));
            trainerService.addWin(attacker.getTrainerName());
            trainerService.addLose(defender.getTrainerName());
            activeBattles.remove(battleId);
            return;
        }

        // 9. 턴 전환
        attacker.changeTurn();
        defender.changeTurn();

        log.info("스킬 사용 성공 battleId: {}", battleId);
        messagingTemplate.convertAndSend(turnDestination, new MatchResponse(battleId, red, blue));
    }

    @Transactional
    public void removeFromQueue(String trainerName) {
        waitingQueue.removeIf(team -> team.getTrainerName().equals(trainerName));
        log.info("큐 대기 취소: {}", trainerName);
    }

    private Integer generateBattleId() {
        return Math.abs(UUID.randomUUID().hashCode()); // UUID 생성, hashCode()로 변환, Integer 사용
    }

}
