package cuketmon.battle.service;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.startsWith;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import cuketmon.TestDummyDataConfig;
import cuketmon.TestSkillDataConfig;
import cuketmon.battle.dto.MatchResponse;
import cuketmon.battle.dto.SkillRequest;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.battle.dto.TurnResponse;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.annotation.DirtiesContext;

@Import({TestSkillDataConfig.class, TestDummyDataConfig.class})
@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class BattleMatchServiceTest {

    @Autowired
    private BattleMatchService battleMatchService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Test
    void 대기자가_없으면_대기열에_등록된다() {
        TrainerRequest trainer = new TrainerRequest("dummy_trainer", 1);

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

    @Test
    void 커켓몬_스킬을_사용하면_계산된_데미지가_전송된다() {
        TrainerRequest trainer1 = new TrainerRequest("attacker", 1);
        TrainerRequest trainer2 = new TrainerRequest("defender", 2);
        battleMatchService.findBattle(trainer1);
        battleMatchService.findBattle(trainer2);

        // MatchResponse 캡쳐 기술
        // UUID를 사용하여 예측 불가능한 battleId를 받아오기 위함
        ArgumentCaptor<MatchResponse> captor = ArgumentCaptor.forClass(MatchResponse.class);
        verify(messagingTemplate, times(1)).convertAndSend(startsWith("/topic/match/"), captor.capture());

        int battleId = captor.getValue().getBattleId();
        battleMatchService.useSkill(battleId, new SkillRequest(1, "attacker"));

        verify(messagingTemplate, times(1)).convertAndSend(startsWith("/topic/turn/"), any(TurnResponse.class));
    }

    @TestConfiguration
    static class TestMockConfig {
        @Bean
        public SimpMessagingTemplate messagingTemplate() {
            return mock(SimpMessagingTemplate.class);
        }
    }

}
