package cuketmon.skill.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class SkillResponse {

    private Integer id;

    private Integer accuracy;

    private String name;

    private Integer power;

    private Integer pp;

    @JsonProperty("type")
    private TypeInfo type;

    @JsonProperty("damage_class")
    private DamageClassInfo damageClass;

    @Getter
    public static class TypeInfo {
        private String name;
    }

    @Getter
    public static class DamageClassInfo {
        private String name;
    }

}
