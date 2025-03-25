package cuketmon.battle.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MatchResponse {

    private Integer battleId;
    private String trainerName;
    private String opponent;

}
