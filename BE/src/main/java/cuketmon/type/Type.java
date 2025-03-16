package cuketmon.type;

import lombok.Getter;

@Getter
public enum Type {

    NORMAL("노말"),
    FIRE("불꽃"),
    WATER("물"),
    ELECTRIC("전기"),
    GRASS("풀"),
    ICE("얼음"),
    FIGHTING("격투"),
    POISON("독"),
    GROUND("땅"),
    FLYING("비행"),
    PSYCHIC("에스퍼"),
    BUG("벌레"),
    ROCK("바위"),
    GHOST("고스트"),
    DRAGON("드래곤"),
    DARK("악"),
    STEEL("강철"),
    FAIRY("페어리");

    private final String koreanTypeName;

    Type(String koreanTypeName) {
        this.koreanTypeName = koreanTypeName;
    }

}
