package cuketmon.monster.service;

import static cuketmon.utill.Random.getRandomInRange;

import cuketmon.damageclass.DamageClass;
import cuketmon.monster.dto.GenerateApiRequestBody;
import cuketmon.monster.dto.MonsterDTO;
import cuketmon.monster.dto.MonsterDTO.MonsterInfo;
import cuketmon.monster.entity.Monster;
import cuketmon.monster.repository.MonsterRepository;
import cuketmon.skill.service.SkillService;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import cuketmon.type.Type;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MonsterService {

    private static final String TEST_TRAINER_NAME = "kng";

    public static final int MIN_BASE = 60;
    public static final int MAX_BASE = 100;

    public static final int MIN_DAMAGE = 10;
    public static final int MID_DAMAGE = 80;
    public static final int MAX_DAMAGE = 500;

    public static final int INIT_AFFINITY = 30;

    private static final int FEED_MINUS = 1;
    private static final int TOY_MINUS = 1;
    private static final int AFFINITY_PLUS = 1;

    private final TrainerRepository trainerRepository;
    private final MonsterRepository monsterRepository;
    private final SkillService skillService;

    @Autowired
    public MonsterService(TrainerRepository trainerRepository, MonsterRepository monsterRepository,
                          SkillService skillService) {
        this.trainerRepository = trainerRepository;
        this.monsterRepository = monsterRepository;
        this.skillService = skillService;
    }

    // 임시 포켓몬 생성 함수
    @Transactional
    public Integer tempGenerate(GenerateApiRequestBody requestBody) {
        Type type1 = Type.fromString(requestBody.getType1());
        Type type2 = Type.fromString(requestBody.getType2()); // nullable 값

        Monster monster = new Monster("", null, INIT_AFFINITY,
                getRandomInRange(MIN_BASE, MAX_BASE), getRandomInRange(MIN_BASE, MAX_BASE),
                getRandomInRange(MIN_BASE, MAX_BASE), getRandomInRange(MIN_BASE, MAX_BASE),
                getRandomInRange(MIN_BASE, MAX_BASE), getRandomInRange(MIN_BASE, MAX_BASE),
                type1, type2, null, null, null, null);

        DamageClass damageClass = DamageClass.fromString(monster.getDamageClass());
        DamageClass altClass = damageClass.getOppositeClass();
        monster.setSkillId1(skillService.getSkillId(type1, damageClass.getName(), MIN_DAMAGE, MID_DAMAGE)); // 평타
        monster.setSkillId2(skillService.getSkillId(type1, damageClass.getName(), MID_DAMAGE, MAX_DAMAGE)); // 필살기
        monster.setSkillId3(skillService.getSkillId(type2, damageClass.getName(), MIN_DAMAGE, MID_DAMAGE));
        monster.setSkillId4(skillService.getSkillId(type2, altClass.getName(), MIN_DAMAGE, MID_DAMAGE));
        monsterRepository.save(monster);

        return monster.getId();
    }

    @Transactional
    public void naming(Integer monsterId, String monsterName) {
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 커켓몬을 찾을 수 없습니다."));

        monster.changeNameTo(monsterName);
        monsterRepository.save(monster);
    }

    @Transactional
    public void release(Integer monsterId) {
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 커켓몬을 찾을 수 없습니다."));

        monsterRepository.delete(monster);
    }

    @Transactional
    public void feed(Integer monsterId) {
        // TODO: 현재 로그인 한 사용자를 기반으로 find 하도록 수정해야함
        //  security context 라는게 있다는데.. (이 방법은 별로인듯 because 누를 때 마다 주인을 찾음)
        //  아니면 프론트에서 기억하고 있는 이름 좀 넘겨달라고 해도 될 듯
        Trainer trainer = trainerRepository.findById(TEST_TRAINER_NAME)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 커켓몬을 찾을 수 없습니다."));

        // TODO: validation 로직 분리 (먹이 수량 확인)
        if (trainer.getFeed() > 0) {
            trainer.decreaseFeed(FEED_MINUS);
            monster.increaseAffinity(AFFINITY_PLUS);

            trainerRepository.save(trainer);
            monsterRepository.save(monster);
        } else {
            throw new IllegalArgumentException("[ERROR] 먹이가 부족합니다.");
        }
    }

    @Transactional
    public void play(Integer monsterId) {
        Trainer trainer = trainerRepository.findById(TEST_TRAINER_NAME)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 커켓몬을 찾을 수 없습니다."));

        // TODO: validation 로직 분리 (장난감 수량 확인)
        if (trainer.getToy() > 0) {
            trainer.decreaseToy(TOY_MINUS);
            monster.increaseAffinity(AFFINITY_PLUS);

            trainerRepository.save(trainer);
            monsterRepository.save(monster);
        } else {
            throw new IllegalArgumentException("[ERROR] 장난감이 부족합니다.");
        }
    }

    @Transactional
    public MonsterDTO.MonsterInfo getMonsterInfo(Integer monsterId) {
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 커켓몬을 찾을 수 없습니다."));

        return new MonsterInfo(monster.getId(), monster.getName(), monster.getImage(), monster.getAffinity());
    }

}
