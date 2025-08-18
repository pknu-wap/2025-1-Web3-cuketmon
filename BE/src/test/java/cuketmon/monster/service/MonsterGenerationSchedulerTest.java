package cuketmon.monster.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cuketmon.monster.entity.Monster;
import cuketmon.monster.repository.MonsterRepository;
import cuketmon.util.SseEmitters;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MonsterGenerationSchedulerTest {

    @Mock
    private MonsterRepository monsterRepository;

    @Mock
    private SseEmitters sseEmitters;

    @InjectMocks
    private MonsterGenerationScheduler scheduler;

    @Test
    void 완료된_몬스터_알림_테스트() {
        // given
        Integer monsterId = 123;
        Monster monster = Monster.builder().id(monsterId).image("image.jpg").build();

        when(sseEmitters.getWaitingMonsterIds()).thenReturn(Set.of(monsterId));
        when(monsterRepository.findById(monsterId)).thenReturn(Optional.of(monster));

        // when
        scheduler.checkMonsterGeneration();

        // then
        verify(sseEmitters).sendToMonster(eq(monsterId), eq("completed"), any());
    }
}