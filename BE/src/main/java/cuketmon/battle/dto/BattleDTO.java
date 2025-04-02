package cuketmon.battle.dto;

import cuketmon.type.Type;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BattleDTO {

    @Getter
    @AllArgsConstructor
    public static class Team {
        private Integer battleId;
        private String trainerName;
        private Monster monster;
        private Boolean turn;
    }

    @Getter
    @AllArgsConstructor
    public static class Monster {
        private String name;
        private String image;
        private Integer affinity;

        private Integer hp;
        private Integer speed;
        private Integer attack;
        private Integer defence;
        private Integer specialAttack;
        private Integer specialDefence;

        private Type type1;
        private Type type2;

        private Skill skill1;
        private Skill skill2;
        private Skill skill3;
        private Skill skill4;
    }

    @Getter
    @AllArgsConstructor
    public static class Skill {
        private Type type;
        private String damageClass;
        private Integer accuracy;
        private String name;
        private Integer power;
        private Integer pp;
    }

}
