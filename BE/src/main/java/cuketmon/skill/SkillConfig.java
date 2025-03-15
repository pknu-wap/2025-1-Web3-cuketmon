package cuketmon.skill;

import cuketmon.skill.service.SkillService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SkillConfig {

    private final SkillService skillService;

    @Autowired
    public SkillConfig(SkillService skillService) {
        this.skillService = skillService;
    }

    // 모든 스킬을 DB에 저장
    @PostConstruct
    public void initSkills() {
        skillService.fetchAndSaveAllSkills();
    }

}
