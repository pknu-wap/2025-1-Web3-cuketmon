package cuketmon.battle.controller;

import cuketmon.battle.dto.EndBattleRequest;
import cuketmon.battle.dto.SkillRequest;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.battle.service.BattleMatchService;
import cuketmon.battle.service.BattleSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
public class BattleWebSocketController {

    private final BattleMatchService battleMatchService;
    private final BattleSkillService battleSkillService;

    // 배틀 찾기 (대기열 등록)
    @MessageMapping("/findBattle")
    public void findBattle(TrainerRequest request) {
        battleMatchService.findBattle(request);
    }

    // 배틀 종료
    @MessageMapping("/endBattle/{battleId}")
    public void endBattle(@DestinationVariable Integer battleId, EndBattleRequest request) {
        battleMatchService.endBattle(battleId, request);
    }

    // 기술 사용
    @MessageMapping("/skill/{battleId}")
    public void useSkill(@DestinationVariable Integer battleId, SkillRequest request) {
        battleSkillService.useSkill(battleId, request);
    }

}
