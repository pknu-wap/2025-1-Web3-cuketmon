package cuketmon.battle.dto;

import cuketmon.monster.dto.MonsterDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BattleDTO {

    private Team red;
    private Team blue;

    @Getter
    @AllArgsConstructor
    public static class Team {
        private String trainerName;
        private MonsterDTO.MonsterBattleInfo monster;
        private String skillAnimation;
        private String skillName;

        public void changeSkillAnimation(String newSkillAnimation) {
            this.skillAnimation = newSkillAnimation;
        }

        public void changeSkillName(String newSkillName) {
            this.skillName = newSkillName;
        }
    }

}
