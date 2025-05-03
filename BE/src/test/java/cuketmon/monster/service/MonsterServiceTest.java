package cuketmon.monster.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import cuketmon.TestDummyDataConfig;
import cuketmon.TestSkillDataConfig;
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
        Trainer trainer = trainerRepository.findById("kng").get();
        int prevFeed = trainer.getFeed().getCount();

        monsterService.feed("kng", 1);

        Trainer updatedTrainer = trainerRepository.findById("kng").get();
        assertEquals(prevFeed - 1, updatedTrainer.getFeed().getCount());
    }

    @Test
    void 장난감이_올바르게_차감되어_DB에_저장되고_조회된다() {
        Trainer trainer = trainerRepository.findById("kng").get();
        int prevToy = trainer.getToy().getCount();

        monsterService.play("kng", 1);

        Trainer updatedTrainer = trainerRepository.findById("kng").get();
        assertEquals(prevToy - 1, updatedTrainer.getToy().getCount());
    }

    @Test
    void 친밀도가_올바르게_증가되어_DB에_저장되고_조회된다() {
        Monster monster = monsterRepository.findById(1).get();
        int prevAffinity = monster.getAffinity().getCount();

        monsterService.play("kng", 1);

        Monster updatedMonster = monsterRepository.findById(1).get();
        assertEquals(prevAffinity + 1, updatedMonster.getAffinity());
    }

}
