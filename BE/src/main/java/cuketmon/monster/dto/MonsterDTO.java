package cuketmon.monster.dto;

import cuketmon.type.Type;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MonsterDTO {

    @Getter
    @AllArgsConstructor
    public static class MonsterInfo {
        private Integer id;
        private String name;
        private String image;
        private Integer affinity;
    }

    @Getter
    @AllArgsConstructor
    public static class MonsterBattleInfo {
        private String name;
        private String image;
        private Integer affinity;

        private Integer hp;
        private Integer speed;
        private Integer attack;
        private Integer defence;
        private Integer specialAttack;
        private Integer specialDefence;

        private String type1;
        private String type2;

        private Skill skill1;
        private Skill skill2;
        private Skill skill3;
        private Skill skill4;

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

}
