package cuketmon;

import cuketmon.monster.embeddable.Affinity;
import cuketmon.monster.entity.Monster;
import cuketmon.monster.repository.MonsterRepository;
import cuketmon.trainer.embeddable.Feed;
import cuketmon.trainer.embeddable.Toy;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import cuketmon.type.Type;
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
        trainerRepository.save(new Trainer("dummy_trainer", new Toy(), new Feed(), 0));
        trainerRepository.save(new Trainer("kng", new Toy(), new Feed(), 0));

        monsterRepository.save(Monster.builder()
                .name("dummy_monster1")
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
                .name("dummy_monster2")
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
