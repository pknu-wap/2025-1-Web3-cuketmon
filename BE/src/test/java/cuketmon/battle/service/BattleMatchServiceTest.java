package cuketmon.battle.service;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.startsWith;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import cuketmon.battle.dto.MatchResponse;
import cuketmon.battle.dto.TrainerRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.annotation.DirtiesContext;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class BattleMatchServiceIntegrationTest {

    @Autowired
    private BattleMatchService battleMatchService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @TestConfiguration
    static class TestMockConfig {
        @Bean
        public SimpMessagingTemplate messagingTemplate() {
            return mock(SimpMessagingTemplate.class);
        }
    }

    @Test
    void 대기자가_없으면_대기열에_등록된다() {
        TrainerRequest trainer = new TrainerRequest("kng", 1);

        battleMatchService.findBattle(trainer);

        verify(messagingTemplate, never()).convertAndSend(anyString(), any(MatchResponse.class));
    }

    @Test
    void 대기자가_있으면_매칭되고_메시지가_전송된다() {
        TrainerRequest trainer1 = new TrainerRequest("first", 1);
        TrainerRequest trainer2 = new TrainerRequest("second", 2);

        battleMatchService.findBattle(trainer1);
        battleMatchService.findBattle(trainer2);

        verify(messagingTemplate, times(1)).convertAndSend(startsWith("/topic/match/"), any(MatchResponse.class));
    }

}