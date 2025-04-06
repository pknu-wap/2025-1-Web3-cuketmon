package cuketmon.battle.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MatchResponse {

    private Integer battleId;
    private BattleDTO.Team trainerName;
    private BattleDTO.Team opponent;

}
