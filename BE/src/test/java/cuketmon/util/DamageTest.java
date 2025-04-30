package cuketmon.util;

import static org.junit.jupiter.api.Assertions.assertTrue;

import cuketmon.TestDummyDataConfig;
import cuketmon.TestSkillDataConfig;
import cuketmon.battle.TeamMaker;
import cuketmon.battle.dto.BattleDTO;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.monster.dto.MonsterDTO;
import cuketmon.skill.service.SkillService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import({TestSkillDataConfig.class, TestDummyDataConfig.class})
@SpringBootTest
class DamageTest {

    private final TeamMaker teamMaker;
    private final SkillService skillService;

    private final TrainerRequest trainerRequest = new TrainerRequest("kng", 1);

    @Autowired
    public DamageTest(TeamMaker teamMaker, SkillService skillService) {
        this.teamMaker = teamMaker;
        this.skillService = skillService;
    }

    @Test
    void 올바른_데미지를_계산한다() {
        BattleDTO.Team attacker = teamMaker.makeTeam(trainerRequest);
        BattleDTO.Team defender = teamMaker.makeTeam(trainerRequest);

        MonsterDTO.MonsterBattleInfo.Skill skill;
        while (true) {
            try {
                skill = skillService.convertSkill(Random.getRandomInRange(1, 919));
                if (skill != null) {
                    break;
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }

        }
        double damage = Damage.makeDamage(attacker.getMonster(), defender.getMonster(), skill);
        System.out.println("power : " + skill.getPower() + "\ndamage : " + damage);

        assertTrue(damage >= 0 && damage <= 255, "데미지는 예상 범위 내에 있어야 합니다.");
    }

}
