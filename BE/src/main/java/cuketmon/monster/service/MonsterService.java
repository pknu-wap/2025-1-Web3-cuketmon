package cuketmon.monster.service;

import cuketmon.monster.entity.Monster;
import cuketmon.monster.repository.MonsterRepository;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MonsterService {

    private static final String TEST_TRAINER_NAME = "kng";

    public static final int INIT_AFFINITY = 30;
    public static final int INIT_HP = 100;
    public static final int INIT_SPEED = 100;
    public static final int INIT_ATTACK = 100;
    public static final int INIT_DEFENCE = 100;
    public static final int INIT_SPECIAL_ATTACK = 100;
    public static final int INIT_SPECIAL_DEFENCE = 100;

    private static final int TOY_MINUS = 1;
    private static final int AFFINITY_PLUS = 1;

    private final TrainerRepository trainerRepository;
    private final MonsterRepository monsterRepository;

    @Autowired
    public MonsterService(TrainerRepository trainerRepository, MonsterRepository monsterRepository) {
        this.trainerRepository = trainerRepository;
        this.monsterRepository = monsterRepository;
    }

    // 임시 포켓몬 생성 함수
    public void tempGenerate(String monsterName) {
        if (!monsterRepository.existsById(monsterName)) {
            Monster monster
                    = new Monster(monsterName, null, INIT_AFFINITY, INIT_HP, INIT_SPEED,
                    INIT_ATTACK, INIT_DEFENCE, INIT_SPECIAL_ATTACK, INIT_SPECIAL_DEFENCE);
            monsterRepository.save(monster);
        }
    }

    public void feedMonster(String monsterName) {
        // TODO: 현재 로그인 한 사용자를 기반으로 find 하도록 수정해야함
        //  security context 라는게 있다는데..
        //  아니면 프론트에서 기억하고 있는 이름 좀 넘겨달라고 해도 될 듯
        Trainer trainer = trainerRepository.findById(TEST_TRAINER_NAME)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR]: 해당 트레이너를 찾을 수 없습니다."));
        Monster monster = monsterRepository.findById(monsterName)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR]: 해당 커켓몬을 찾을 수 없습니다."));

        // TODO: validation 로직 분리 (먹이 수량 확인)
        // TODO: setter 사용 지양
        if (trainer.getFeed() > 0) {
            trainer.setFeed(trainer.getFeed() - TOY_MINUS);
            monster.setAffinity(monster.getAffinity() + AFFINITY_PLUS);

            trainerRepository.save(trainer);
            monsterRepository.save(monster);
        } else {
            throw new IllegalArgumentException("[ERROR] 먹이가 부족합니다.");
        }
    }

}
