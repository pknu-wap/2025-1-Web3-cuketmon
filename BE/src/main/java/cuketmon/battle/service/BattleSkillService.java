package cuketmon.battle.service;

import static cuketmon.battle.constant.BattleConst.SKILL_INDEX_BLUE;
import static cuketmon.battle.constant.BattleConst.SKILL_INDEX_RED;
import static cuketmon.util.Damage.makeDamage;

import cuketmon.battle.dto.BattleDTO;
import cuketmon.battle.dto.MatchResponse;
import cuketmon.battle.dto.SkillRequest;
import cuketmon.battle.repository.ActiveBattles;
import cuketmon.monster.dto.MonsterDTO.MonsterBattleInfo;
import cuketmon.util.CustomLogger;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.Logger;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BattleSkillService {

    private static final Logger log = CustomLogger.getLogger(BattleMatchService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final ActiveBattles activeBattles;
    private final Map<Integer, Integer[]> requestedSkills = new HashMap<>();

    @Transactional
    public void useSkill(Integer battleId, SkillRequest request) {
        // 0. red, blue 스킬이 요청되었는지 검사
        requestedSkills.putIfAbsent(battleId, new Integer[2]);
        setSkill(battleId, request);

        Integer[] skillIndexes = requestedSkills.get(battleId);
        if (skillIndexes[SKILL_INDEX_RED] == null || skillIndexes[SKILL_INDEX_BLUE] == null) {
            return;
        }

        BattleDTO battle = activeBattles.get(battleId);

        BattleDTO.Team red = battle.getRed();
        MonsterBattleInfo redMonster = red.getMonster();
        MonsterBattleInfo.Skill redSkill = redMonster.getSkills().get(skillIndexes[SKILL_INDEX_RED]);

        BattleDTO.Team blue = battle.getBlue();
        MonsterBattleInfo blueMonster = blue.getMonster();
        MonsterBattleInfo.Skill blueSkill = blueMonster.getSkills().get(skillIndexes[SKILL_INDEX_BLUE]);

        // 1. 데미지 계산
        int redDamage = (int) makeDamage(redMonster, blueMonster, redSkill);
        int blueDamage = (int) makeDamage(blueMonster, redMonster, blueSkill);

        // 2. 선공 판단
        boolean isRedFirst = isRedFirst(redMonster, blueMonster, redSkill, blueSkill);

        // 3. hp, pp 차감
        if (isRedFirst) {
            blue.getMonster().applyDamage(redDamage);
            redSkill.usePp(1);

            red.getMonster().applyDamage(blueDamage);
            blueSkill.usePp(1);
        } else {
            red.getMonster().applyDamage(blueDamage);
            blueSkill.usePp(1);

            blue.getMonster().applyDamage(redDamage);
            redSkill.usePp(1);
        }

        log.info("스킬 사용 성공     battleId: {}", battleId);
        log.info("HP 감소 완료 red  Team HP: {}, damage: {}", redMonster.getHp(), blueDamage);
        log.info("HP 감소 완료 blue Team HP: {}, damage: {}", blueMonster.getHp(), redDamage);

        // 4. 전송
        messagingTemplate.convertAndSend("/topic/battle/" + battleId,
                new MatchResponse(battleId, red, blue, isRedFirst));
        log.info("응답 전송 성공     battleId: {}", battleId);
        requestedSkills.remove(battleId);
    }

    private boolean isRedFirst(MonsterBattleInfo red, MonsterBattleInfo blue,
                               MonsterBattleInfo.Skill redSkill, MonsterBattleInfo.Skill blueSkill) {
        if (!Objects.equals(redSkill.getPriority(), blueSkill.getPriority())) {
            return redSkill.getPriority() > blueSkill.getPriority();
        }
        return red.getSpeed() >= blue.getSpeed();
    }

    private void setSkill(Integer battleId, SkillRequest skillRequest) {
        BattleDTO.Team red = activeBattles.get(battleId).getRed();
        BattleDTO.Team blue = activeBattles.get(battleId).getBlue();

        if (red.getTrainerName().equals(skillRequest.getTrainerName())) {
            requestedSkills.get(battleId)[SKILL_INDEX_RED] = skillRequest.getSkillId();
            red.changeSkillAnimation(skillRequest.getAnimationUrl());
            red.changeSkillName(skillRequest.getSkillName());
        } else {
            requestedSkills.get(battleId)[SKILL_INDEX_BLUE] = skillRequest.getSkillId();
            blue.changeSkillAnimation(skillRequest.getAnimationUrl());
            blue.changeSkillName(skillRequest.getSkillName());
        }
    }

}
