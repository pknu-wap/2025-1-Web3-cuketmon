package cuketmon.skill.service;

import static cuketmon.constant.message.ErrorMessages.SKILL_NOT_FOUND;
import static cuketmon.skill.constant.SkillConst.SKILL_API_URL;
import static cuketmon.skill.constant.SkillConst.TOTAL_SKILL;

import cuketmon.constant.damageclass.DamageClass;
import cuketmon.constant.type.Type;
import cuketmon.monster.dto.MonsterDTO;
import cuketmon.skill.dto.SkillResponse;
import cuketmon.skill.entity.Skill;
import cuketmon.skill.repository.SkillRepository;
import cuketmon.util.CustomLogger;
import cuketmon.util.Random;
import java.util.Collections;
import java.util.List;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class SkillService {

    private static final Logger log = CustomLogger.getLogger(SkillService.class);

    private final SkillRepository skillRepository;
    private final WebClient skillWebClient;

    @Autowired
    public SkillService(SkillRepository skillRepository, WebClient skillWebClient) {
        this.skillRepository = skillRepository;
        this.skillWebClient = skillWebClient;
    }

    // TODO: 앞서 분배한 스킬과 겹치는 스킬을 주는 오류도 있을듯
    //  스킬을 List로 만들어서 중복검사 하면 깔끔 할 듯
    // 스킬 분배 로직
    @Transactional
    public Integer getSkillId(Type type, DamageClass damageClass, int minDamage, int maxDamage) {
        List<Skill> skills
                = skillRepository.findAllByTypeAndDamageClassAndPowerBetween(type, damageClass, minDamage, maxDamage)
                .orElse(Collections.emptyList());

        // 줄 스킬이 없다면 모든 스킬 중 랜덤으로 하나 주기
        if (skills.isEmpty()) {
            return skillRepository.findAnyRandomSkill().getId();
        }
        // 찾은 스킬들 중 랜덤으로 하나 선택
        return skills.get(Random.getRandomInRange(0, skills.size() - 1)).getId();
    }

    public MonsterDTO.MonsterBattleInfo.Skill convertSkill(Integer skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException(SKILL_NOT_FOUND));

        return new MonsterDTO.MonsterBattleInfo.Skill(
                skill.getType(),
                skill.getDamageClass().toString(),
                skill.getAccuracy(),
                skill.getKoreanName(),
                skill.getPower(),
                skill.getPp(),
                skill.getPriority()
        );
    }

    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    // 전체 스킬 저장 (919개)
    public void fetchAndSaveAllSkills() {
        skillRepository.deleteAll();
        for (int i = 1; i <= TOTAL_SKILL; i++) {
            fetchAndSaveSkill(i);
        }
    }

    // 스킬 하나를 받아서 저장
    private void fetchAndSaveSkill(int skillId) {
        try {
            SkillResponse skillResponse = skillWebClient.get()
                    .uri(SKILL_API_URL + "/" + skillId)
                    .retrieve()
                    .bodyToMono(SkillResponse.class)
                    .block();
            if (skillResponse != null) {
                saveSkill(skillResponse);
            }
        } catch (Exception e) {
            log.info("{}", e.getMessage());
        }
    }

    // DB에 저장
    private void saveSkill(SkillResponse skillResponse) {
        Skill skill = Skill.builder()
                .id(skillResponse.getId())
                .type(Type.fromString(skillResponse.getType().getName()))
                .damageClass(DamageClass.fromString(skillResponse.getDamageClass().getName()))
                .accuracy(skillResponse.getAccuracy())
                .englishName(skillResponse.getName())
                .koreanName(skillResponse.getKoreanName())
                .power(skillResponse.getPower())
                .pp(skillResponse.getPp())
                .priority(skillResponse.getPriority())
                .build();

        if (skill.getPower() == null) {
            throw new IllegalArgumentException("power가 null인 스킬은 받지 않습니다.");
        }

        skillRepository.save(skill);
        log.info("{}번 Skill 저장완료.", skillResponse.getId());
    }

}
