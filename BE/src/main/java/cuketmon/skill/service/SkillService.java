package cuketmon.skill.service;

import cuketmon.damageclass.DamageClass;
import cuketmon.monster.dto.MonsterDTO;
import cuketmon.skill.dto.SkillResponse;
import cuketmon.skill.entity.Skill;
import cuketmon.skill.repository.SkillRepository;
import cuketmon.type.Type;
import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class SkillService {

    private static final int TOTAL_SKILL = 919;
    private static final String SKILL_API_URL = "https://pokeapi.co/api/v2/move";

    private final SkillRepository skillRepository;
    private final WebClient skillWebClient;

    @Autowired
    public SkillService(SkillRepository skillRepository, WebClient skillWebClient) {
        this.skillRepository = skillRepository;
        this.skillWebClient = skillWebClient;
    }

    // skillId로 Skill 객체 조회
    @Transactional
    public Skill getSkillById(Integer skillId) {
        return skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("[Error] 해당 ID의 스킬이 없습니다."));
    }

    // 스킬 분배 로직
    @Transactional
    public Integer getSkillId(Type type, DamageClass damageClass, int minDamage, int maxDamage) {
        List<Skill> skills
                = skillRepository.findAllByTypeAndDamageClassAndPowerBetween(type, damageClass, minDamage, maxDamage)
                .orElseThrow(() -> new IllegalArgumentException("[Error] 조건을 만족하는 스킬이 없습니다."));

        if (skills.isEmpty()) {
            throw new IllegalArgumentException("[Error] 조건을 만족하는 스킬이 없습니다.");
        }

        // 찾은 스킬들 중 랜덤으로 하나 선택
        return skills.get(new Random().nextInt(skills.size())).getId();
    }

    public MonsterDTO.MonsterBattleInfo.Skill convertSkill(Integer skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 ID의 스킬이 없습니다."));

        return new MonsterDTO.MonsterBattleInfo.Skill(
                skill.getType(),
                skill.getDamageClass().toString(),
                skill.getAccuracy(),
                skill.getName(),
                skill.getPower(),
                skill.getPp()
        );
    }

    // 전체 스킬 저장 (919개)
    public void fetchAndSaveAllSkills() {
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
            System.out.println("[ERROR] " + skillId + "번 스킬 저장 중 오류 발생: " + e.getMessage());
        }
    }

    // DB에 저장
    private void saveSkill(SkillResponse skillResponse) {
        Skill skill = new Skill(
                skillResponse.getId(),
                Type.fromString(skillResponse.getType().getName()),
                DamageClass.fromString(skillResponse.getDamageClass().getName()),
                skillResponse.getAccuracy(),
                skillResponse.getName(),
                skillResponse.getPower(),
                skillResponse.getPp()
        );
        skillRepository.save(skill);

        System.out.println("Skill 저장완료. Id: " + skillResponse.getId());
    }

}
