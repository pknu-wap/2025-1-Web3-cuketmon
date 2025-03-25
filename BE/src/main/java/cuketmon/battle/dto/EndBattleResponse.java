package cuketmon.battle.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EndBattleResponse {

    private String battleId;
    private String result;

}
