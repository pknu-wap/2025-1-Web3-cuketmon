package cuketmon.battle.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SkillRequest {

    Integer skillId;
    String trainerName;
    String animationUrl;

}
