package cuketmon.constant.damageclass;

import java.util.Arrays;

public enum DamageClass {

    PHYSICAL,
    SPECIAL;

    public static DamageClass fromString(String damageClass) {
        if (damageClass == null || damageClass.isBlank()) {
            throw new IllegalArgumentException("[ERROR] 입력값이 비어있습니다.");
        }
        return Arrays.stream(values())
                .filter(dc -> dc.name().equalsIgnoreCase(damageClass))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 존재하지 않는 기술형태 입니다."));
    }

    public DamageClass getOppositeClass() {
        return this == PHYSICAL ? SPECIAL : PHYSICAL;
    }

}
