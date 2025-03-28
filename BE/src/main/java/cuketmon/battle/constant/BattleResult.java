package cuketmon.battle.constant;

public enum BattleResult {

    TRAINER1_WIN,
    TRAINER2_WIN,
    DRAW;

    public String getName() {
        return this.name().toLowerCase();
    }

}
