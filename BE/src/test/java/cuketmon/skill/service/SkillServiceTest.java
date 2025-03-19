package cuketmon.skill.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import cuketmon.skill.entity.Skill;
import cuketmon.skill.repository.SkillRepository;
import cuketmon.type.Type;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Transactional
class SkillServiceTest {

    @Autowired
    private SkillService skillService;

    @Autowired
    private SkillRepository skillRepository;

    @BeforeEach
    void setUp() {
        // 테스트용 스킬 데이터 저장
        skillRepository.save(new Skill(1, Type.FIRE, "physical", 100, "Flame Thrower", 90, 15));
        skillRepository.save(new Skill(2, Type.WATER, "physical", 95, "Water Punch", 75, 20));
        skillRepository.save(new Skill(3, Type.WATER, "special", 90, "Water kick", 40, 25));
        skillRepository.save(new Skill(4, Type.GRASS, "special", 95, "Grass Punch", 75, 20));
        skillRepository.save(new Skill(5, Type.GRASS, "special", 80, "Grass kick", 120, 5));
    }

    @Test
    void 랜덤_스킬을_올바르게_부여하는가_타입_테스트() {
        Integer skillId = skillService.getSkillId(Type.FIRE, "physical", 30, 100);
        assertEquals(1, skillId);
    }

    @Test
    void 랜덤_스킬을_올바르게_부여하는가_데미지_클래스_테스트() {
        Integer skillId = skillService.getSkillId(Type.WATER, "special", 30, 100);
        assertEquals(3, skillId);
    }

    @Test
    void 랜덤_스킬을_올바르게_부여하는가_데미지_범위_테스트() {
        Integer skillId = skillService.getSkillId(Type.GRASS, "special", 30, 100);
        assertEquals(4, skillId);
    }

}
