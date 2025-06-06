package cuketmon.skill.service;

import static cuketmon.constant.message.ErrorMessages.SKILL_NOT_FOUND;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cuketmon.config.TestDummyDataConfig;
import cuketmon.config.TestSkillDataConfig;
import cuketmon.constant.damageclass.DamageClass;
import cuketmon.constant.type.Type;
import cuketmon.skill.entity.Skill;
import cuketmon.skill.repository.SkillRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import({TestSkillDataConfig.class, TestDummyDataConfig.class})
@SpringBootTest
class SkillServiceTest {

    @Autowired
    private SkillService skillService;

    @Autowired
    private SkillRepository skillRepository;

    @Test
    void 랜덤_스킬을_올바르게_부여하는가_데미지_클래스_테스트() {
        Integer skillId = skillService.getSkillId(Type.WATER, DamageClass.SPECIAL, 30, 100);

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException(SKILL_NOT_FOUND));

        assertEquals(DamageClass.SPECIAL.toString(), skill.getDamageClass().toString());
    }

    @Test
    void 랜덤_스킬을_올바르게_부여하는가_데미지_범위_테스트() {
        Integer skillId = skillService.getSkillId(Type.GRASS, DamageClass.SPECIAL, 30, 100);

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException(SKILL_NOT_FOUND));

        assertTrue(skill.getPower() >= 30 && skill.getPower() <= 100);
    }

    @Test
    void type이_null이라도_오류가_나지않고_랜덤한_스킬이_저장된다() {
        Integer skillId = skillService.getSkillId(null, DamageClass.SPECIAL, 30, 100);

        assertNotNull(skillId, "type이 null이어도 랜덤 스킬 ID가 반환되어야 합니다.");
    }

}
