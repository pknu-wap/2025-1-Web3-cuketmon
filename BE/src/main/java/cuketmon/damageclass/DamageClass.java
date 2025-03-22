package cuketmon.damageclass;

public enum DamageClass {
    PHYSICAL,
    SPECIAL;

    public String getName() {
        return this.name().toLowerCase();
    }

    public static DamageClass fromString(String damageClass) {
        return switch (damageClass.toLowerCase()) {
            case "physical" -> PHYSICAL;
            case "special" -> SPECIAL;
            default -> throw new IllegalArgumentException("[ERROR] 존재하지 않는 기술형태 입니다.");
        };
    }

    public DamageClass getOppositeClass() {
        return this == PHYSICAL ? SPECIAL : PHYSICAL;
    }

}
