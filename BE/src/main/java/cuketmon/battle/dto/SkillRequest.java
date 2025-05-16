package cuketmon.battle.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SkillRequest {

    private Integer skillId;
    private String trainerName;
    private String animationUrl;

}
