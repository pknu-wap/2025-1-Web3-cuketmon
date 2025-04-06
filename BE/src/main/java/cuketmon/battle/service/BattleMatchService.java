package cuketmon.battle.service;

import cuketmon.battle.constant.BattleStatus;
import cuketmon.battle.dto.BattleDTO;
import cuketmon.battle.dto.EndBattleResponse;
import cuketmon.battle.dto.ErrorResponse;
import cuketmon.battle.dto.MatchResponse;
import cuketmon.battle.dto.SkillRequest;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.battle.dto.TurnResponse;
import cuketmon.monster.dto.MonsterDTO;
import cuketmon.monster.dto.MonsterDTO.MonsterBattleInfo;
import cuketmon.monster.service.MonsterService;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BattleMatchService {

    private final SimpMessagingTemplate messagingTemplate;

    private final Queue<BattleDTO.Team> waitingQueue = new LinkedList<>();
    private final Map<Integer, BattleDTO> activeBattles = new HashMap<>();
    private final MonsterService monsterService;


    @Autowired
    public BattleMatchService(SimpMessagingTemplate messagingTemplate, MonsterService monsterService) {
        this.messagingTemplate = messagingTemplate;
        this.monsterService = monsterService;
    }

    @Transactional
    public void findBattle(TrainerRequest request) {
        if (waitingQueue.isEmpty()) {
            waitingQueue.add(makeTeam(request));
            return;
        }

        BattleDTO.Team red = waitingQueue.poll();
        BattleDTO.Team blue = makeTeam(request);

        Integer battleId = generateBattleId();
        activeBattles.put(battleId, new BattleDTO(red, blue));

        System.out.println("매칭된 배틀 생성: battleId=" + battleId + ", trainer1=" + blue + ", trainer2=" + red);
        messagingTemplate.convertAndSend("/topic/match/" + battleId, new MatchResponse(battleId, blue, red));
    }

    @Transactional
    public void endBattle(Integer battleId) {
        System.out.println("배틀 종료 요청 수신: battleId = " + battleId);
        messagingTemplate.convertAndSend("/topic/battleEnd/" + battleId,
                new EndBattleResponse(battleId, BattleStatus.FINISHED.getName()));
    }

    // TODO: 클래스 기능 분리하기
    @Transactional
    public void useSkill(Integer battleId, SkillRequest skillRequest) {
        String destination = "/topic/turn/" + battleId;

        // 1. 배틀 확인
        BattleDTO battle = activeBattles.get(battleId);
        if (battle == null) {
            messagingTemplate.convertAndSend(destination, new ErrorResponse("해당 배틀을 찾을 수 없습니다."));
            return;
        }

        // 2. 공격자 방어자 구분
        BattleDTO.Team attacker;
        BattleDTO.Team defender;
        if (battle.getRed().getTrainerName().equals(skillRequest.getTrainerName())) {
            attacker = battle.getRed();
            defender = battle.getBlue();
        } else if (battle.getBlue().getTrainerName().equals(skillRequest.getTrainerName())) {
            attacker = battle.getBlue();
            defender = battle.getRed();
        } else {
            messagingTemplate.convertAndSend(destination, new ErrorResponse("트레이너를 찾을 수 없습니다."));
            return;
        }

        // 3. 공격자 턴 검증
        if (!attacker.getTurn()) {
            messagingTemplate.convertAndSend(destination, new ErrorResponse("상대의 턴 입니다."));
            return;
        }

        // 4. 공격 스킬 선택
        MonsterDTO.MonsterBattleInfo attackerMonster = attacker.getMonster();
        List<MonsterBattleInfo.Skill> skills = attackerMonster.getSkills();

        int skillNumber = skillRequest.getSkillId();
        if (skillNumber < 1 || skillNumber > skills.size()) {
            messagingTemplate.convertAndSend(destination, new ErrorResponse("잘못된 스킬 번호입니다."));
            return;
        }
        MonsterDTO.MonsterBattleInfo.Skill usedSkill = skills.get(skillNumber - 1);

        // 6. PP 확인 및 차감
        if (usedSkill.getPp() <= 0) {
            messagingTemplate.convertAndSend(destination, new ErrorResponse("PP가 부족합니다."));
            return;
        }
        usedSkill.usePp(1);

        // TODO: damage계산 로직 생성하기
        //  일단 기본 power로 설정
        // 7. 데미지 계산 
        int damage = usedSkill.getPower();

        // 8. 방어자 몬스터 HP 갱신
        MonsterDTO.MonsterBattleInfo defenderMonster = defender.getMonster();
        defenderMonster.applyDamage(damage);

        // 9. 턴 전환
        attacker.changeTurn();
        defender.changeTurn();

        messagingTemplate.convertAndSend(destination, new TurnResponse(battleId, damage));
    }

    private BattleDTO.Team makeTeam(TrainerRequest request) {
        return new BattleDTO.Team(request.getTrainerName(),
                monsterService.getMonsterBattleInfo(request.getMonsterId()),
                false);
    }

    private Integer generateBattleId() {
        return Math.abs(UUID.randomUUID().hashCode()); // UUID 생성, hashCode()로 변환, Integer 사용
    }

}
