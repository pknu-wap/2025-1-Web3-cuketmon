package cuketmon.battle.util;

import cuketmon.battle.dto.BattleDTO;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.monster.service.MonsterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TeamMaker {

    private final MonsterService monsterService;

    public BattleDTO.Team makeTeam(TrainerRequest request) {
        return new BattleDTO.Team(
                request.getTrainerName(),
                monsterService.getMonsterBattleInfo(request.getMonsterId()),
                null,
                null
        );
    }

}
