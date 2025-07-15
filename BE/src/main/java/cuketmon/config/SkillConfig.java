package cuketmon.config;

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
        // 서버 시작 최초 1회만 등록
        // skillService.fetchAndSaveAllSkills();
    }

}
