package cuketmon.util;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Component
public class SseEmitters {

    private final Map<Integer, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter add(Integer monsterId, SseEmitter emitter) {
        this.emitters.put(monsterId, emitter);
        log.info("new emitter added for monsterId: {}", monsterId);
        log.info("emitter list size: {}", emitters.size());

        emitter.onCompletion(() -> {
            log.info("onCompletion callback for monsterId: {}", monsterId);
            this.emitters.remove(monsterId);
        });

        emitter.onTimeout(() -> {
            log.info("onTimeout callback for monsterId: {}", monsterId);
            this.emitters.remove(monsterId);
            emitter.complete();
        });

        emitter.onError((ex) -> {
            log.error("onError callback for monsterId: {}", monsterId, ex);
            this.emitters.remove(monsterId);
        });

        return emitter;
    }

    public void sendToMonster(Integer monsterId, String eventName, Object data) {
        SseEmitter emitter = emitters.get(monsterId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
                log.info("SSE event sent to monsterId: {}, event: {}", monsterId, eventName);

                // 완료 이벤트 전송 후 연결 종료 및 제거
                if ("completed".equals(eventName)) {
                    emitter.complete();
                    emitters.remove(monsterId);
                }
            } catch (IOException e) {
                log.error("Failed to send SSE event to monsterId: {}", monsterId, e);
                emitters.remove(monsterId);
            }
        }
    }

    public Set<Integer> getWaitingMonsterIds() {
        return new HashSet<>(emitters.keySet());
    }

}