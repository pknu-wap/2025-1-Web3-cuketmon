package cuketmon.battle.config;

import cuketmon.battle.service.BattleMatchService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private final BattleMatchService battleMatchService;

    public WebSocketEventListener(BattleMatchService battleMatchService) {
        this.battleMatchService = battleMatchService;
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String trainerName = (String) accessor.getSessionAttributes().get("trainerName");

        if (trainerName != null) {
            battleMatchService.removeFromQueue(trainerName);
        }
    }
}