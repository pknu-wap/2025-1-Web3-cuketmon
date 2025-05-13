package cuketmon.battle.repository;

import cuketmon.battle.dto.BattleDTO;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class ActiveBattles {

    private final Map<Integer, BattleDTO> activeBattles = new HashMap<>();

    public void add(Integer battleId, BattleDTO.Team red, BattleDTO.Team blue) {
        activeBattles.put(battleId, new BattleDTO(red, blue));
    }

    public BattleDTO get(Integer battleId) {
        return activeBattles.get(battleId);
    }

    public void remove(Integer battleId) {
        activeBattles.remove(battleId);
    }

}
