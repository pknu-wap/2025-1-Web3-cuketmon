package cuketmon.type;

import lombok.Getter;

@Getter
public enum Type {

    NORMAL("노말", "normal"),
    FIRE("불꽃", "fire"),
    WATER("물", "water"),
    ELECTRIC("전기", "electric"),
    GRASS("풀", "grass"),
    ICE("얼음", "ice"),
    FIGHTING("격투", "fighting"),
    POISON("독", "poison"),
    GROUND("땅", "ground"),
    FLYING("비행", "flying"),
    PSYCHIC("에스퍼", "psychic"),
    BUG("벌레", "bug"),
    ROCK("바위", "rock"),
    GHOST("고스트", "ghost"),
    DRAGON("드래곤", "dragon"),
    DARK("악", "dark"),
    STEEL("강철", "steel"),
    FAIRY("페어리", "fairy");

    private final String koreanName;
    private final String englishName;

    Type(String koreanName, String englishName) {
        this.koreanName = koreanName;
        this.englishName = englishName;
    }

}
