package cuketmon.battle.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MatchResponse {

    private Integer battleId;
    private BattleDTO.Team red;
    private BattleDTO.Team blue;
    boolean isRedFirst;

}
