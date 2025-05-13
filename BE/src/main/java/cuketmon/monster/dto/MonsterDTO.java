package cuketmon.monster.dto;

import cuketmon.constant.type.Type;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MonsterDTO {

    // for myPage
    @Getter
    @AllArgsConstructor
    public static class MonsterInfo {
        private Integer id;
        private String name;
        private String image;
        private Integer affinity;
    }

    // for battle
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

        private List<Skill> skills;

        public Integer applyDamage(int amount) {
            this.hp -= amount;
            if (this.hp < 0) {
                this.hp = 0;
            }
            return this.hp;
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
            private Integer priority;

            public void usePp(int amount) {
                this.pp -= amount;
            }
        }
    }

}
