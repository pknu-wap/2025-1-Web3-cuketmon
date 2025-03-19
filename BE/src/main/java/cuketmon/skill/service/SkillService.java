package cuketmon.skill.service;

import cuketmon.skill.dto.SkillResponse;
import cuketmon.skill.entity.Skill;
import cuketmon.skill.repository.SkillRepository;
import cuketmon.type.Type;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    // 스킬 분배 로직
    @Transactional
    public Integer getSkillId(Type type, String damageClass, int startDamage, int endDamage) {
        List<Skill> skills = skillRepository.findAllByTypeAndDamageClassAndPowerBetween(
                        type, damageClass, startDamage, endDamage)
                .orElseThrow(() -> new IllegalArgumentException("[Error] 조건을 만족하는 스킬이 없습니다."));

        if (skills.isEmpty()) {
            throw new IllegalArgumentException("[Error] 조건을 만족하는 스킬이 없습니다.");
        }

        // 찾은 스킬들 중 랜덤으로 하나 선택
        return skills.get(new Random().nextInt(skills.size())).getId();
    }

    // TODO: 너무 느림 flux? 써서 고쳐야함
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
                Type.toType(skillResponse.getType().getName()),
                skillResponse.getDamageClass().getName(),
                skillResponse.getAccuracy(),
                skillResponse.getName(),
                skillResponse.getPower(),
                skillResponse.getPp()
        );
        skillRepository.save(skill);

        System.out.println("Skill 저장완료. Id: " + skillResponse.getId());
    }

}
