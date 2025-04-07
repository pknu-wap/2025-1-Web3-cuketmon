package cuketmon.utill;

import static cuketmon.type.TypeDamageTable.getDamageMultiplier;
import static cuketmon.utill.Random.getRandomInRange;

import cuketmon.monster.dto.MonsterDTO;
import cuketmon.type.Type;

// TODO: 테스트 작성!!!!!!!!!!!!
public class Damage {

    // TODO: 매직넘버 분리
    // 데미지 = ([power] × [(sp)attack] × ([affinity] × 2 ÷ 5 + 2 ) ÷ [(sp)defence] ÷ 50 × [critical] + 2 )
    //          × [typeBonus] × [typeAdvantage1] × [typeAdvantage2] × [randomInt]/255
    public static double makeDamage(MonsterDTO.MonsterBattleInfo attacker, MonsterDTO.MonsterBattleInfo defender,
                                    MonsterDTO.MonsterBattleInfo.Skill skill) {
        int attack = getAttack(attacker, skill.getDamageClass());
        int defence = defender.getDefence();

        int power = skill.getPower();
        int affinity = attacker.getAffinity();

        int critical = getCritical();
        int randomInt = getRandomInRange(200, 255);

        Type skillType = skill.getType();
        double typeBonus = getTypeBonus(attacker, skillType.getEnglishName());
        double typeAdvantage1 = getDamageMultiplier(Type.fromString(defender.getType1()), skillType);
        double typeAdvantage2 = getDamageMultiplier(Type.fromString(defender.getType2()), skillType);

        return (power * attack * (affinity * 2.0 / 5 + 2) / defence / 50 * critical + 2)
                * typeBonus * typeAdvantage1 * typeAdvantage2 * randomInt / 255;
    }

    // TODO: DamageClass Enum 또는 상수화 고려
    private static int getAttack(MonsterDTO.MonsterBattleInfo monster, String damageClass) {
        if (damageClass.equals("physical")) {
            return monster.getAttack();
        }
        return monster.getSpecialAttack();
    }

    private static int getCritical() {
        if (getRandomInRange(1, 100) < 20) {
            return 2;
        }
        return 1;
    }

    private static double getTypeBonus(MonsterDTO.MonsterBattleInfo monster, String type) {
        if (monster.getType1().equals(type) || monster.getType2().equals(type)) {
            return 1.5;
        }
        return 1.0;
    }

}
