package cuketmon.monster.dto;

import lombok.Getter;

@Getter
public class MonsterDTO {

    @Getter
    public static class MonsterInfo {
        private Integer id;
        private String name;
        private String image;
        private Integer affinity;
    }

    @Getter
    public static class MonsterBattleInfo {
        private Integer id;
        private String name;
        private String image;

        private Integer hp;
        private Integer speed;
        private Integer attack;
        private Integer defence;
        private Integer specialAttack;
        private Integer specialDefence;

        private String type1;
        private String type2;

        private Integer skillId1;
        private Integer skillId2;
        private Integer skillId3;
        private Integer skillId4;
    }

}
