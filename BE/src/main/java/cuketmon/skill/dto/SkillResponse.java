package cuketmon.skill.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Getter;

@Getter
public class SkillResponse {

    private Integer id;

    private Integer accuracy;

    private String name;

    private Integer power;

    private Integer pp;

    private Integer priority;

    @JsonProperty("type")
    private TypeInfo type;

    @JsonProperty("damage_class")
    private DamageClassInfo damageClass;

    @JsonProperty("names")
    private List<NameEntry> names;

    @Getter
    public static class TypeInfo {
        private String name;
    }

    @Getter
    public static class DamageClassInfo {
        private String name;
    }

    @Getter
    public static class NameEntry {
        private String name;

        private Language language;

        @Getter
        public static class Language {
            private String name;
        }
    }

    public String getKoreanName() {
        return names.stream()
                .filter(name -> "ko".equals(name.getLanguage().getName()))
                .map(NameEntry::getName)
                .findFirst()
                .orElse("이름 없음");
    }

}
