package cuketmon.type;

import java.util.Arrays;
import lombok.Getter;

@Getter
public enum Type {

    NORMAL(0, "노말", "normal"),
    FIRE(1, "불꽃", "fire"),
    WATER(2, "물", "water"),
    ELECTRIC(3, "전기", "electric"),
    GRASS(4, "풀", "grass"),
    ICE(5, "얼음", "ice"),
    FIGHTING(6, "격투", "fighting"),
    POISON(7, "독", "poison"),
    GROUND(8, "땅", "ground"),
    FLYING(9, "비행", "flying"),
    PSYCHIC(10, "에스퍼", "psychic"),
    BUG(11, "벌레", "bug"),
    ROCK(12, "바위", "rock"),
    GHOST(13, "고스트", "ghost"),
    DRAGON(14, "드래곤", "dragon"),
    DARK(15, "악", "dark"),
    STEEL(16, "강철", "steel"),
    FAIRY(17, "페어리", "fairy");

    private final Integer id;
    private final String koreanName;
    private final String englishName;

    Type(Integer id, String koreanName, String englishName) {
        this.id = id;
        this.koreanName = koreanName;
        this.englishName = englishName;
    }

    public static Type fromString(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("[ERROR] 입력값이 비어있습니다.");
        }

        System.out.println("[LOG] 입력된 타입 값: \"" + name + "\"");

        return Arrays.stream(values())
                .filter(type -> type.name().equalsIgnoreCase(name) ||
                        type.koreanName.equalsIgnoreCase(name) ||
                        type.englishName.equalsIgnoreCase(name))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 잘못된 타입입니다."));
    }

}
