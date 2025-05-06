package cuketmon.battle.util;

import cuketmon.battle.dto.BattleDTO;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.monster.service.MonsterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TeamMaker {

    private final MonsterService monsterService;

    @Autowired
    public TeamMaker(MonsterService monsterService) {
        this.monsterService = monsterService;
    }

    public BattleDTO.Team makeTeam(TrainerRequest request) {
        return new BattleDTO.Team(
                request.getTrainerName(),
                monsterService.getMonsterBattleInfo(request.getMonsterId()),
                false
        );
    }

}
