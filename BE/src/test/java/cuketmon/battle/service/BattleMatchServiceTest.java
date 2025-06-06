package cuketmon.battle.service;

import static cuketmon.constant.TestConfig.TRAINER1;
import static cuketmon.constant.TestConfig.TRAINER2;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.startsWith;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import cuketmon.battle.dto.MatchResponse;
import cuketmon.battle.dto.SkillRequest;
import cuketmon.battle.dto.TrainerRequest;
import cuketmon.config.TestDummyDataConfig;
import cuketmon.config.TestSkillDataConfig;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.annotation.DirtiesContext;

@Import({TestSkillDataConfig.class, TestDummyDataConfig.class})
@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class BattleMatchServiceTest {

    @Autowired
    private BattleMatchService battleMatchService;

    @Autowired
    private BattleSkillService battleSkillService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Test
    void 대기자가_없으면_대기열에_등록된다() {
        TrainerRequest trainer = new TrainerRequest(TRAINER1, 1);

        battleMatchService.findBattle(trainer);

        verify(messagingTemplate, never()).convertAndSend(anyString(), any(MatchResponse.class));
    }

    @Test
    void 대기자가_있으면_매칭되고_메시지가_전송된다() {
        TrainerRequest trainer1 = new TrainerRequest(TRAINER1, 1);
        TrainerRequest trainer2 = new TrainerRequest(TRAINER2, 2);

        battleMatchService.findBattle(trainer1);
        battleMatchService.findBattle(trainer2);

        verify(messagingTemplate, times(1)).convertAndSend(startsWith("/topic/match/"), any(MatchResponse.class));
    }

    @Test
    void 커켓몬_스킬을_사용하면_계산된_데미지가_전송된다() {
        TrainerRequest trainer1 = new TrainerRequest(TRAINER1, 1);
        TrainerRequest trainer2 = new TrainerRequest(TRAINER2, 2);
        battleMatchService.findBattle(trainer1);
        battleMatchService.findBattle(trainer2);

        // MatchResponse 캡쳐 기술
        // UUID를 사용하여 예측 불가능한 battleId를 받아오기 위함
        ArgumentCaptor<MatchResponse> captor = ArgumentCaptor.forClass(MatchResponse.class);
        verify(messagingTemplate, times(1)).convertAndSend(startsWith("/topic/match/"), captor.capture());

        int battleId = captor.getValue().getBattleId();
        battleSkillService.useSkill(battleId, new SkillRequest(1, TRAINER1, "url", "name"));
        battleSkillService.useSkill(battleId, new SkillRequest(1, TRAINER2, "url", "name"));

        verify(messagingTemplate, times(1)).convertAndSend(startsWith("/topic/battle/"), any(MatchResponse.class));
    }

    @TestConfiguration
    static class TestMockConfig {
        @Bean
        @Primary
        public SimpMessagingTemplate messagingTemplate() {
            return mock(SimpMessagingTemplate.class);
        }
    }

}
