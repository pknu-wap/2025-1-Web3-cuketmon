package cuketmon.skill.service;

import cuketmon.skill.dto.SkillResponse;
import cuketmon.skill.entity.Skill;
import cuketmon.skill.repository.SkillRepository;
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

    // TODO: 너무 느림 flux? 써서 고쳐야함
    // 전체 스킬 저장 (919개)
    public void fetchAndSaveAllSkills() {
        for (int i = 0; i <= TOTAL_SKILL; i++) {
            if (!fetchAndSaveSkill(i)) {
                break;
            }
        }
    }

    // 스킬 하나를 받아서 저장
    public boolean fetchAndSaveSkill(int skillId) {
        try {
            SkillResponse skillResponse = skillWebClient.get()
                    .uri(SKILL_API_URL + "/" + skillId)
                    .retrieve()
                    .bodyToMono(SkillResponse.class)
                    .block();

            if (skillResponse != null) {
                saveSkill(skillResponse);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // DB에 저장
    private void saveSkill(SkillResponse skillResponse) {
        Skill skill = new Skill(
                skillResponse.getId(),
                skillResponse.getType().getName(),
                skillResponse.getAccuracy(),
                skillResponse.getName(),
                skillResponse.getPower(),
                skillResponse.getPp()
        );
        skillRepository.save(skill);

        System.out.println("Skill 저장완료. Id: " + skillResponse.getId());
    }

}
