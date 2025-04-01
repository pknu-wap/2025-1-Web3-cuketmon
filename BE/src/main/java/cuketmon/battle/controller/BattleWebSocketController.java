package cuketmon.battle.controller;

import cuketmon.battle.dto.TrainerRequest;
import cuketmon.battle.service.BattleMatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class BattleWebSocketController {

    private final BattleMatchService battleMatchService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public BattleWebSocketController(BattleMatchService battleMatchService, SimpMessagingTemplate messagingTemplate) {
        this.battleMatchService = battleMatchService;
        this.messagingTemplate = messagingTemplate;
    }

    // 배틀 찾기 (대기열 등록)
    @MessageMapping("/findBattle")
    public void findBattle(TrainerRequest request) {
        battleMatchService.findBattle(request.getTrainerName());
    }

    // 배틀 종료
    @MessageMapping("/endBattle/{battleId}")
    public void endBattle(@DestinationVariable String battleId) {
        battleMatchService.endBattle(battleId);
    }

//    // 기술 사용
//    @MessageMapping("/skill/{battleId}")
//    public void makeMove(@DestinationVariable String battleId, MoveRequest move) {
//        messagingTemplate.convertAndSend("/topic/move/" + battleId, move);
//    }

}
