package cuketmon.battle.controller;

import cuketmon.battle.dto.SkillRequest;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.battle.service.BattleMatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class BattleWebSocketController {

    private final BattleMatchService battleMatchService;

    @Autowired
    public BattleWebSocketController(BattleMatchService battleMatchService) {
        this.battleMatchService = battleMatchService;
    }

    // 배틀 찾기 (대기열 등록)
    @MessageMapping("/findBattle")
    public void findBattle(TrainerRequest request) {
        battleMatchService.findBattle(request);
    }

    // 배틀 종료
    @MessageMapping("/endBattle/{battleId}")
    public void endBattle(@DestinationVariable Integer battleId) {
        battleMatchService.endBattle(battleId);
    }

    // TODO: response 변경하기
    // 기술 사용
    @MessageMapping("/skill/{battleId}")
    public void useSkill(@DestinationVariable Integer battleId, SkillRequest skill) {
        battleMatchService.useSkill(battleId, skill);
    }

}
