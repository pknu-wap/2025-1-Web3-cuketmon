package cuketmon.skill.service;

import cuketmon.skill.dto.AllSkillResponse;
import cuketmon.skill.dto.SkillResponse;
import cuketmon.skill.entity.Skill;
import cuketmon.skill.repository.SkillRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class SkillService {

    private static final String SKILL_API_URL = "https://pokeapi.co/api/v2/move";

    private final SkillRepository skillRepository;
    private final WebClient skillWebClient;

    @Autowired
    public SkillService(SkillRepository skillRepository, WebClient skillWebClient) {
        this.skillRepository = skillRepository;
        this.skillWebClient = skillWebClient;
    }

    // TODO: 너무 느림 flux? 써서 고쳐야함
    // 전체 스킬 저장 함수 호출 로직
    public void fetchAndSaveAllSkills() {
        int totalSkills = getTotalSkillsCount();
        for (int i = 0; i <= totalSkills; i++) {
            if (!fetchAndSaveSkill(i)) {
                break;
            }
        }
    }

    // 전체 스킬 개수 저장
    private int getTotalSkillsCount() {
        return Optional.ofNullable(skillWebClient.get()
                        .uri(SKILL_API_URL)
                        .retrieve()
                        .bodyToMono(AllSkillResponse.class)
                        .block())
                .map(AllSkillResponse::getCount)
                .orElse(0);
    }

    // TODO: 920이상 부터는 404 에러 발생하는데 이것 때문에 try catch 사용
    //  구조 개선 필요할지도..?
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

        System.out.println("Skill 저장완료. Id: " + skillResponse.getId());

        skillRepository.save(skill);
    }

}
