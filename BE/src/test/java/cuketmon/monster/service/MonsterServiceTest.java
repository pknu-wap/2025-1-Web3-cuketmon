package cuketmon.monster.service;

import static cuketmon.constant.TestConfig.TRAINER1;
import static cuketmon.constant.TestConfig.TRAINER2;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import cuketmon.config.TestDummyDataConfig;
import cuketmon.config.TestSkillDataConfig;
import cuketmon.monster.dto.GenerateApiRequestBody;
import cuketmon.monster.entity.Monster;
import cuketmon.monster.repository.MonsterRepository;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import cuketmon.trainer.service.TrainerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import({TestSkillDataConfig.class, TestDummyDataConfig.class})
@SpringBootTest
class MonsterServiceTest {

    @Autowired
    TrainerRepository trainerRepository;

    @Autowired
    MonsterRepository monsterRepository;

    @Autowired
    TrainerService trainerService;

    @Autowired
    MonsterService monsterService;

    @Test
    void 먹이가_올바르게_차감되어_DB에_저장되고_조회된다() {
        Trainer trainer = trainerRepository.findById(TRAINER1).get();
        int prevFeed = trainer.getFeed().getCount();

        monsterService.feed(TRAINER1, 1);

        Trainer updatedTrainer = trainerRepository.findById(TRAINER1).get();
        assertEquals(prevFeed - 1, updatedTrainer.getFeed().getCount());
    }

    @Test
    void 장난감이_올바르게_차감되어_DB에_저장되고_조회된다() {
        Trainer trainer = trainerRepository.findById(TRAINER1).get();
        int prevToy = trainer.getToy().getCount();

        monsterService.play(TRAINER1, 1);

        Trainer updatedTrainer = trainerRepository.findById(TRAINER1).get();
        assertEquals(prevToy - 1, updatedTrainer.getToy().getCount());
    }

    @Test
    void 친밀도가_올바르게_증가되어_DB에_저장되고_조회된다() {
        Monster monster = monsterRepository.findById(1).get();
        int prevAffinity = monster.getAffinity().getCount();

        monsterService.play(TRAINER1, 1);

        Monster updatedMonster = monsterRepository.findById(1).get();
        assertEquals(prevAffinity + 1, updatedMonster.getAffinity().getCount());
    }

    @Test
    void 자신의_커켓몬이_아닐경우_오류를_발생시킨다() {
        assertThrows(IllegalArgumentException.class, () -> monsterService.play(TRAINER2, 1));
        assertThrows(IllegalArgumentException.class, () -> monsterService.feed(TRAINER2, 1));
        assertThrows(IllegalArgumentException.class, () -> monsterService.naming(TRAINER2, 1, "temp"));
    }

    @Test
    void 커켓몬을_다섯마리_이상_보유할_시_오류를_발생시킨다() {
        GenerateApiRequestBody body = new GenerateApiRequestBody("FIRE", "ELECTRIC", "temp");
        monsterService.generate(TRAINER1, body);
        monsterService.generate(TRAINER1, body);
        monsterService.generate(TRAINER1, body);
        monsterService.generate(TRAINER1, body);

        // 5마리 제한 확인
        // config에서 1마리 생성했으므로 4마리 추가 생성 후 assertThrows 테스트
        assertThrows(IllegalArgumentException.class, () -> monsterService.generate(TRAINER1, body));
    }

}
