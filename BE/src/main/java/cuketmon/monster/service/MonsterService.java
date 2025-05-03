package cuketmon.monster.service;

import static cuketmon.util.Random.getRandomInRange;

import cuketmon.damageclass.DamageClass;
import cuketmon.monster.dto.GenerateApiRequestBody;
import cuketmon.monster.dto.MonsterDTO;
import cuketmon.monster.dto.MonsterDTO.MonsterBattleInfo;
import cuketmon.monster.dto.MonsterDTO.MonsterInfo;
import cuketmon.monster.embeddable.Affinity;
import cuketmon.monster.entity.Monster;
import cuketmon.monster.repository.MonsterRepository;
import cuketmon.skill.service.SkillService;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import cuketmon.type.Type;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MonsterService {

    public static final int MIN_BASE = 60;
    public static final int MAX_BASE = 100;

    public static final int MIN_DAMAGE = 10;
    public static final int MID_DAMAGE = 80;
    public static final int MAX_DAMAGE = 500;

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

    // 포켓몬 생성 함수
    @Transactional
    public Integer generate(GenerateApiRequestBody requestBody) {
        Type type1 = Type.fromString(requestBody.getType1());
        Type type2 = Type.fromString(requestBody.getType2()); // nullable 값

        int attack = getRandomInRange(MIN_BASE, MAX_BASE);
        int specialAttack = getRandomInRange(MIN_BASE, MAX_BASE);
        DamageClass damageClass = (attack >= specialAttack) ? DamageClass.PHYSICAL : DamageClass.SPECIAL;
        DamageClass altClass = damageClass.getOppositeClass();

        /*
            서버에서는 image를 null처리해놓음
            AI에서 image가 null인 monster가 들어오면 관측 후 이미지 생성

            1. DB에서 직접 변경하여 커켓몬 이미지 지정
            or
            2. 백엔드에서 api 만들어서 커켓몬 이미지 지정
        */

        // TODO: 타입이 널일 때 스킬 받아오는 데 문제 생김
        Monster monster = Monster.builder()
                .name("")
                .image(null)
                .description(requestBody.getDescription())
                .affinity(new Affinity())
                .hp(getRandomInRange(MIN_BASE, MAX_BASE))
                .speed(getRandomInRange(MIN_BASE, MAX_BASE))
                .attack(attack)
                .defence(getRandomInRange(MIN_BASE, MAX_BASE))
                .specialAttack(specialAttack)
                .specialDefence(getRandomInRange(MIN_BASE, MAX_BASE))
                .type1(type1)
                .type2(type2)
                .skillId1(skillService.getSkillId(type1, damageClass, MIN_DAMAGE, MID_DAMAGE)) // 평타
                .skillId2(skillService.getSkillId(type1, damageClass, MID_DAMAGE, MAX_DAMAGE)) // 필살기
                .skillId3(type2 != null ? skillService.getSkillId(type2, damageClass, MIN_DAMAGE, MID_DAMAGE) : null)
                .skillId4(type2 != null ? skillService.getSkillId(type2, altClass, MIN_DAMAGE, MID_DAMAGE) : null)
                .build();

        monsterRepository.save(monster);
        System.out.println("디비 저장 완");

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

    // TODO: 스피드도 객체화 하면 좋을 듯
    @Transactional
    public void feed(String trainerName, Integer monsterId) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 커켓몬을 찾을 수 없습니다."));

        try {
            trainer.getFeed().decrease(FEED_MINUS);
            monster.increaseSpeed(monster.getAffinity().increase(AFFINITY_PLUS));
            trainerRepository.save(trainer);
            monsterRepository.save(monster);
        } catch (Exception e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    @Transactional
    public void play(String trainerName, Integer monsterId) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 커켓몬을 찾을 수 없습니다."));

        try {
            trainer.getToy().decrease(TOY_MINUS);
            monster.increaseSpeed(monster.getAffinity().increase(AFFINITY_PLUS));
            trainerRepository.save(trainer);
            monsterRepository.save(monster);
        } catch (Exception e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    @Transactional
    public MonsterDTO.MonsterInfo getMonsterInfo(Integer monsterId) {
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 커켓몬을 찾을 수 없습니다."));

        return new MonsterInfo(
                monster.getId(),
                monster.getName(), monster.getImage(),
                monster.getAffinity().getCount()
        );
    }

    @Transactional
    public MonsterDTO.MonsterBattleInfo getMonsterBattleInfo(Integer monsterId) {
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 커켓몬을 찾을 수 없습니다."));

        return new MonsterBattleInfo(
                monster.getName(), monster.getImage(), monster.getAffinity().getCount(),
                monster.getHp(), monster.getSpeed(),
                monster.getAttack(), monster.getDefence(),
                monster.getSpecialAttack(), monster.getSpecialDefence(),
                monster.getType1().getEnglishName(), monster.getType2().getEnglishName(),
                List.of(skillService.convertSkill(monster.getSkillId1()),
                        skillService.convertSkill(monster.getSkillId2()),
                        skillService.convertSkill(monster.getSkillId3()),
                        skillService.convertSkill(monster.getSkillId4()))
        );
    }

}
