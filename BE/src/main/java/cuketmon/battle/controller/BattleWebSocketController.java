package cuketmon.battle.controller;

import cuketmon.battle.constant.BattleStatus;
import cuketmon.battle.dto.EndBattleResponse;
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
        System.out.println("배틀 종료 요청 수신: battleId = " + battleId);
        messagingTemplate.convertAndSend("/topic/battleEnd/" + battleId,
                new EndBattleResponse(battleId, BattleStatus.FINISHED.getName()));
        System.out.println("배틀 종료 메시지 전송 완료: battleId = " + battleId);
    }

    // 배틀 중 동작
    //@MessageMapping("/move/{battleId}")
    //public void makeMove(@DestinationVariable String battleId, MoveRequest move) {
    //    messagingTemplate.convertAndSend("/topic/move/" + battleId, move);
    //}

}
