package cuketmon.config;

import static cuketmon.constant.TestConfig.MONSTER1;
import static cuketmon.constant.TestConfig.MONSTER2;
import static cuketmon.constant.TestConfig.TRAINER1;
import static cuketmon.constant.TestConfig.TRAINER2;

import cuketmon.constant.type.Type;
import cuketmon.monster.embeddable.Affinity;
import cuketmon.monster.entity.Monster;
import cuketmon.monster.repository.MonsterRepository;
import cuketmon.trainer.embeddable.Feed;
import cuketmon.trainer.embeddable.Toy;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;

@TestConfiguration
public class TestDummyDataConfig {

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private MonsterRepository monsterRepository;

    @PostConstruct
    public void initDummyData() {
        trainerRepository.save(Trainer.builder()
                .name(TRAINER1)
                .toy(new Toy())
                .feed(new Feed())
                .win(0)
                .lose(0)
                .build());
        trainerRepository.save(Trainer.builder()
                .name(TRAINER2)
                .toy(new Toy())
                .feed(new Feed())
                .win(0)
                .lose(0)
                .build());

        monsterRepository.save(Monster.builder()
                .name(MONSTER1)
                .image(null)
                .description("this is dummy monster1 for test")
                .affinity(new Affinity())
                .hp(89)
                .speed(100)
                .attack(83)
                .defence(76)
                .specialAttack(80)
                .specialDefence(92)
                .type1(Type.NORMAL)
                .type2(Type.FIRE)
                .skillId1(1)
                .skillId2(2)
                .skillId3(3)
                .skillId4(4)
                .build());
        monsterRepository.save(Monster.builder()
                .name(MONSTER2)
                .image(null)
                .description("this is dummy monster2 for test")
                .affinity(new Affinity())
                .hp(89)
                .speed(92)
                .attack(83)
                .defence(76)
                .specialAttack(80)
                .specialDefence(92)
                .type1(Type.NORMAL)
                .type2(Type.FIRE)
                .skillId1(1)
                .skillId2(2)
                .skillId3(3)
                .skillId4(4)
                .build());
    }

}
