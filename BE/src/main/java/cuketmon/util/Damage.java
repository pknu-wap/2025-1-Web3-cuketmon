package cuketmon.util;

import static cuketmon.constant.type.TypeDamageTable.getDamageMultiplier;
import static cuketmon.util.Random.getRandomInRange;

import cuketmon.constant.damageclass.DamageClass;
import cuketmon.constant.type.Type;
import cuketmon.monster.dto.MonsterDTO.MonsterBattleInfo;

public class Damage {

    private static final int CRITICAL_CHANCE = 20;

    /*
    데미지 = ([power] × [(sp)attack] × ([affinity] × 2 ÷ 5 + 2 ) ÷ [(sp)defence] ÷ 50 × [critical] + 2)
            × [typeBonus] × [typeAdvantage1] × [typeAdvantage2] × [randomInt]/255
     */

    public static double makeDamage(MonsterBattleInfo attacker, MonsterBattleInfo defender,
                                    MonsterBattleInfo.Skill skill) {
        int attack = getAttack(attacker, skill.getDamageClass());
        int defence = defender.getDefence();

        int power = skill.getPower();
        int affinity = attacker.getAffinity();

        int critical = getCritical();
        int randomInt = getRandomInRange(200, 255);

        Type skillType = skill.getType();
        double typeBonus = getTypeBonus(attacker, skillType.getEnglishName());

        Type defenderType1 = Type.fromString(defender.getType1());
        Type defenderType2 = Type.fromString(defender.getType2());
        double typeAdvantage1 = getDamageMultiplier(skillType, defenderType1);
        double typeAdvantage2 = (defenderType2 != null) ? getDamageMultiplier(skillType, defenderType2) : 1.0;

        double damage = (power * attack * (affinity * 2.0 / 5 + 2) / defence / 50 * critical + 2)
                * typeBonus * typeAdvantage1 * typeAdvantage2 * randomInt / 255;
        if (damage > 255) {
            damage = 255;
        }

        return damage;
    }

    private static int getAttack(MonsterBattleInfo monster, String damageClass) {
        if (damageClass.equals(DamageClass.PHYSICAL.toString())) {
            return monster.getAttack();
        }
        return monster.getSpecialAttack();
    }

    private static int getCritical() {
        if (getRandomInRange(1, 100) < CRITICAL_CHANCE) {
            return 2;
        }
        return 1;
    }

    private static double getTypeBonus(MonsterBattleInfo monster, String type) {
        if (monster.getType1().equals(type) || (monster.getType2() != null && monster.getType2().equals(type))) {
            return 1.5;
        }
        return 1.0;
    }

}
