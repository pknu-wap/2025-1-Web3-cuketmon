package cuketmon.constant.type;

import static cuketmon.constant.type.TypeConst.HIGH;
import static cuketmon.constant.type.TypeConst.LOW;
import static cuketmon.constant.type.TypeConst.MID;
import static cuketmon.constant.type.TypeConst.NONE;

import java.util.ArrayList;
import java.util.List;

public class TypeDamageTable {

    private static final List<List<Double>> typeDamageTable;

    // static 초기화 (클래스 로딩 시 단 한 번 실행)
    static {
        typeDamageTable = initializeDamageTable();
        setAllTypeDamage();
    }

    private TypeDamageTable() {
    }

    public static double getDamageMultiplier(Type attacker, Type defender) {
        return typeDamageTable.get(attacker.getId()).get(defender.getId());
    }

    // 데미지 지정 함수
    private static List<List<Double>> initializeDamageTable() {
        List<List<Double>> table = new ArrayList<>();
        for (int i = 0; i < Type.values().length; i++) {
            List<Double> row = new ArrayList<>();
            for (int j = 0; j < Type.values().length; j++) {
                row.add(MID);
            }
            table.add(row);
        }
        return table;
    }

    private static void setAllTypeDamage() {
        setNormalDamage(Type.NORMAL);
        setFireDamage(Type.FIRE);
        setWaterDamage(Type.WATER);
        setElectricDamage(Type.ELECTRIC);
        setGrassDamage(Type.GRASS);
        setIceDamage(Type.ICE);
        setFightingDamage(Type.FIGHTING);
        setPoisonDamage(Type.POISON);
        setGroundDamage(Type.GROUND);
        setFlyingDamage(Type.FLYING);
        setPsychicDamage(Type.PSYCHIC);
        setBugDamage(Type.BUG);
        setRockDamage(Type.ROCK);
        setGhostDamage(Type.GHOST);
        setDragonDamage(Type.DRAGON);
        setDarkDamage(Type.DARK);
        setSteelDamage(Type.STEEL);
        setFairyDamage(Type.FAIRY);
    }

    private static void setNormalDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, MID);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, MID);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, LOW);
        setDamage(type, Type.GHOST, NONE);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, LOW);
        setDamage(type, Type.FAIRY, MID);
    }

    private static void setFireDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, LOW);
        setDamage(type, Type.WATER, LOW);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, HIGH);
        setDamage(type, Type.ICE, HIGH);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, HIGH);
        setDamage(type, Type.ROCK, LOW);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, LOW);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, HIGH);
        setDamage(type, Type.FAIRY, MID);
    }

    private static void setWaterDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, HIGH);
        setDamage(type, Type.WATER, LOW);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, MID);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, HIGH);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, HIGH);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, LOW);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, MID);
        setDamage(type, Type.FAIRY, MID);
    }

    private static void setElectricDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, MID);
        setDamage(type, Type.WATER, HIGH);
        setDamage(type, Type.ELECTRIC, LOW);
        setDamage(type, Type.GRASS, LOW);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, NONE);
        setDamage(type, Type.FLYING, HIGH);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, MID);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, LOW);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, MID);
        setDamage(type, Type.FAIRY, MID);
    }

    private static void setGrassDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, LOW);
        setDamage(type, Type.WATER, HIGH);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, LOW);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, LOW);
        setDamage(type, Type.GROUND, HIGH);
        setDamage(type, Type.FLYING, LOW);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, LOW);
        setDamage(type, Type.ROCK, HIGH);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, LOW);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, LOW);
        setDamage(type, Type.FAIRY, MID);
    }

    private static void setIceDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, LOW);
        setDamage(type, Type.WATER, LOW);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, HIGH);
        setDamage(type, Type.ICE, LOW);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, HIGH);
        setDamage(type, Type.FLYING, HIGH);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, MID);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, HIGH);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, LOW);
        setDamage(type, Type.FAIRY, LOW);
    }

    private static void setFightingDamage(Type type) {
        setDamage(type, Type.NORMAL, HIGH);
        setDamage(type, Type.FIRE, MID);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, MID);
        setDamage(type, Type.ICE, HIGH);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, LOW);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, LOW);
        setDamage(type, Type.PSYCHIC, LOW);
        setDamage(type, Type.BUG, LOW);
        setDamage(type, Type.ROCK, HIGH);
        setDamage(type, Type.GHOST, NONE);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, HIGH);
        setDamage(type, Type.STEEL, HIGH);
        setDamage(type, Type.FAIRY, LOW);
    }

    private static void setPoisonDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, MID);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, HIGH);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, LOW);
        setDamage(type, Type.GROUND, LOW);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, LOW);
        setDamage(type, Type.GHOST, LOW);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, NONE);
        setDamage(type, Type.FAIRY, HIGH);
    }

    private static void setGroundDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, HIGH);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, HIGH);
        setDamage(type, Type.GRASS, LOW);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, HIGH);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, NONE);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, LOW);
        setDamage(type, Type.ROCK, HIGH);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, HIGH);
        setDamage(type, Type.FAIRY, MID);
    }

    private static void setFlyingDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, MID);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, LOW);
        setDamage(type, Type.GRASS, HIGH);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, HIGH);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, HIGH);
        setDamage(type, Type.ROCK, LOW);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, LOW);
        setDamage(type, Type.FAIRY, MID);
    }

    private static void setPsychicDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, MID);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, MID);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, HIGH);
        setDamage(type, Type.POISON, HIGH);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, LOW);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, MID);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, NONE);
        setDamage(type, Type.STEEL, LOW);
        setDamage(type, Type.FAIRY, NONE);
    }

    private static void setBugDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, LOW);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, HIGH);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, LOW);
        setDamage(type, Type.POISON, LOW);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, LOW);
        setDamage(type, Type.PSYCHIC, HIGH);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, MID);
        setDamage(type, Type.GHOST, LOW);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, HIGH);
        setDamage(type, Type.STEEL, LOW);
        setDamage(type, Type.FAIRY, LOW);
    }

    private static void setRockDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, HIGH);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, MID);
        setDamage(type, Type.ICE, HIGH);
        setDamage(type, Type.FIGHTING, LOW);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, LOW);
        setDamage(type, Type.FLYING, HIGH);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, HIGH);
        setDamage(type, Type.ROCK, MID);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, LOW);
        setDamage(type, Type.FAIRY, MID);
    }

    private static void setGhostDamage(Type type) {
        setDamage(type, Type.NORMAL, NONE);
        setDamage(type, Type.FIRE, MID);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, MID);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, HIGH);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, MID);
        setDamage(type, Type.GHOST, HIGH);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, LOW);
        setDamage(type, Type.STEEL, MID);
        setDamage(type, Type.FAIRY, MID);
    }

    private static void setDragonDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, MID);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, MID);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, MID);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, HIGH);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, LOW);
        setDamage(type, Type.FAIRY, NONE);
    }

    private static void setDarkDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, MID);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, MID);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, LOW);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, HIGH);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, MID);
        setDamage(type, Type.GHOST, HIGH);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, LOW);
        setDamage(type, Type.STEEL, MID);
        setDamage(type, Type.FAIRY, LOW);
    }

    private static void setSteelDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, LOW);
        setDamage(type, Type.WATER, LOW);
        setDamage(type, Type.ELECTRIC, LOW);
        setDamage(type, Type.GRASS, MID);
        setDamage(type, Type.ICE, HIGH);
        setDamage(type, Type.FIGHTING, MID);
        setDamage(type, Type.POISON, MID);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, HIGH);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, MID);
        setDamage(type, Type.DARK, MID);
        setDamage(type, Type.STEEL, LOW);
        setDamage(type, Type.FAIRY, HIGH);
    }

    private static void setFairyDamage(Type type) {
        setDamage(type, Type.NORMAL, MID);
        setDamage(type, Type.FIRE, LOW);
        setDamage(type, Type.WATER, MID);
        setDamage(type, Type.ELECTRIC, MID);
        setDamage(type, Type.GRASS, MID);
        setDamage(type, Type.ICE, MID);
        setDamage(type, Type.FIGHTING, HIGH);
        setDamage(type, Type.POISON, LOW);
        setDamage(type, Type.GROUND, MID);
        setDamage(type, Type.FLYING, MID);
        setDamage(type, Type.PSYCHIC, MID);
        setDamage(type, Type.BUG, MID);
        setDamage(type, Type.ROCK, MID);
        setDamage(type, Type.GHOST, MID);
        setDamage(type, Type.DRAGON, HIGH);
        setDamage(type, Type.DARK, HIGH);
        setDamage(type, Type.STEEL, LOW);
        setDamage(type, Type.FAIRY, MID);
    }

    private static void setDamage(Type attacker, Type defender, double multiplier) {
        typeDamageTable.get(attacker.getId()).set(defender.getId(), multiplier);
    }

}
