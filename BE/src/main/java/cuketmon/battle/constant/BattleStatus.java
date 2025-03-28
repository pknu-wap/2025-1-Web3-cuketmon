package cuketmon.battle.constant;

public enum BattleStatus {

    WAITING,
    ONGOING,
    FINISHED;

    public String getName() {
        return this.name().toLowerCase();
    }

}
