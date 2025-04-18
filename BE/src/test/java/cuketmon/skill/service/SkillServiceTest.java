package cuketmon.skill.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cuketmon.damageclass.DamageClass;
import cuketmon.skill.entity.Skill;
import cuketmon.type.Type;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SkillServiceTest {

    @Autowired
    private SkillService skillService;

    @Test
    void 랜덤_스킬을_올바르게_부여하는가_데미지_클래스_테스트() {
        Integer skillId = skillService.getSkillId(Type.WATER, DamageClass.SPECIAL, 30, 100);
        Skill skill = skillService.getSkillById(skillId);
        assertEquals(DamageClass.SPECIAL.toString(), skill.getDamageClass().toString());
    }

    @Test
    void 랜덤_스킬을_올바르게_부여하는가_데미지_범위_테스트() {
        Integer skillId = skillService.getSkillId(Type.GRASS, DamageClass.SPECIAL, 30, 100);
        Skill skill = skillService.getSkillById(skillId);
        assertTrue(skill.getPower() >= 30 && skill.getPower() <= 100);
    }

}
