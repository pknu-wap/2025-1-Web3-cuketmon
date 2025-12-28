package cuketmon.config;

import cuketmon.skill.service.SkillService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class SkillConfig {

    private final SkillService skillService;

    // 모든 스킬을 DB에 저장
    @PostConstruct
    public void initSkills() {
        // 서버 시작 최초 1회만 등록
        // skillService.fetchAndSaveAllSkills();
    }

}
