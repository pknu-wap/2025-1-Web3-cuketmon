package cuketmon.battle.dto;

import cuketmon.monster.dto.MonsterDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BattleDTO {

    @Getter
    @AllArgsConstructor
    public static class Team {
        private String trainerName;
        private MonsterDTO.MonsterBattleInfo monster;
        private Boolean turn;
    }

}
