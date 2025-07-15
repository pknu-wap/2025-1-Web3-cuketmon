package cuketmon.battle.constant;

public enum BattleResult {

    RED_WIN,
    BLUE_WIN,
    DRAW;

    public String getName() {
        return this.name().toLowerCase();
    }

}
