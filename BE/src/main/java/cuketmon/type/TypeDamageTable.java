package cuketmon.type;

import java.util.ArrayList;
import java.util.List;

public class TypeDamageTable {

    public static final double HIGH = 2.0;
    public static final double MID = 1.0;
    public static final double LOW = 0.5;
    public static final double NONE = 0.0;

    private final List<List<Double>> typeDamageTable;

    public TypeDamageTable() {
        this.typeDamageTable = initializeDamageTable();
        setAllTypeDamage();
    }


    public double getDamageMultiplier(Type attacker, Type defender) {
        return typeDamageTable.get(attacker.getId()).get(defender.getId());
    }

    private List<List<Double>> initializeDamageTable() {
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

    // 여기서부터 데미지 지정 함수
    private void setAllTypeDamage() {
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

    private void setNormalDamage(Type type) {
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

    private void setFireDamage(Type type) {
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

    private void setWaterDamage(Type type) {
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

    private void setElectricDamage(Type type) {
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

    private void setGrassDamage(Type type) {
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

    private void setIceDamage(Type type) {
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

    private void setFightingDamage(Type type) {
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

    private void setPoisonDamage(Type type) {
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

    private void setGroundDamage(Type type) {
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

    private void setFlyingDamage(Type type) {
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

    private void setPsychicDamage(Type type) {
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

    private void setBugDamage(Type type) {
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

    private void setRockDamage(Type type) {
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

    private void setGhostDamage(Type type) {
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

    private void setDragonDamage(Type type) {
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

    private void setDarkDamage(Type type) {
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

    private void setSteelDamage(Type type) {
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

    private void setFairyDamage(Type type) {
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

    private void setDamage(Type attacker, Type defender, double multiplier) {
        typeDamageTable.get(attacker.getId()).set(defender.getId(), multiplier);
    }

}
