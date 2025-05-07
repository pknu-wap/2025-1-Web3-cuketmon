package cuketmon.monster.service;

import static cuketmon.constant.message.ErrorMessages.GENERATE_LIMIT_EXCEEDED;
import static cuketmon.constant.message.ErrorMessages.MONSTER_INVALID_OWNER;
import static cuketmon.constant.message.ErrorMessages.MONSTER_LIMIT_EXCEEDED;
import static cuketmon.constant.message.ErrorMessages.MONSTER_NOT_FOUND;
import static cuketmon.constant.message.ErrorMessages.TRAINER_NOT_FOUND;
import static cuketmon.monster.constant.MonsterConst.AFFINITY_PLUS;
import static cuketmon.monster.constant.MonsterConst.FEED_MINUS;
import static cuketmon.monster.constant.MonsterConst.MAX_BASE;
import static cuketmon.monster.constant.MonsterConst.MAX_DAMAGE;
import static cuketmon.monster.constant.MonsterConst.MAX_GENERATE_LIMIT;
import static cuketmon.monster.constant.MonsterConst.MAX_MONSTER_LIMIT;
import static cuketmon.monster.constant.MonsterConst.MID_DAMAGE;
import static cuketmon.monster.constant.MonsterConst.MIN_BASE;
import static cuketmon.monster.constant.MonsterConst.MIN_DAMAGE;
import static cuketmon.monster.constant.MonsterConst.TOY_MINUS;
import static cuketmon.util.Random.getRandomInRange;

import cuketmon.constant.damageclass.DamageClass;
import cuketmon.constant.type.Type;
import cuketmon.monster.dto.GenerateApiRequestBody;
import cuketmon.monster.dto.MonsterDTO;
import cuketmon.monster.dto.MonsterDTO.MonsterBattleInfo;
import cuketmon.monster.dto.MonsterDTO.MonsterInfo;
import cuketmon.monster.embeddable.Affinity;
import cuketmon.monster.entity.Monster;
import cuketmon.monster.repository.MonsterRepository;
import cuketmon.prompt.service.PromptService;
import cuketmon.skill.service.SkillService;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import cuketmon.util.CustomLogger;
import java.time.LocalDateTime;
import java.util.List;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MonsterService {

    private static final Logger log = CustomLogger.getLogger(MonsterService.class);

    private final TrainerRepository trainerRepository;
    private final MonsterRepository monsterRepository;
    private final SkillService skillService;
    private final PromptService promptService;

    @Autowired
    public MonsterService(TrainerRepository trainerRepository, MonsterRepository monsterRepository,
                          SkillService skillService, PromptService promptService) {
        this.trainerRepository = trainerRepository;
        this.monsterRepository = monsterRepository;
        this.skillService = skillService;
        this.promptService = promptService;
    }

    // 포켓몬 생성 함수
    @Transactional
    public Integer generate(String trainerName, GenerateApiRequestBody requestBody) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        // 최대 보유 커켓몬 제한
        if (trainer.getMonsters().size() >= MAX_MONSTER_LIMIT) {
            throw new IllegalArgumentException(MONSTER_LIMIT_EXCEEDED);
        }

        // 일일 최대 커켓몬 생성 제한
        Integer generateCount = trainer.addGenerateCount();
        if (generateCount >= MAX_GENERATE_LIMIT) {
            if (isOver24Hours(trainer.getLastGenerateTime())) {
                trainer.initGenerateCount();
            } else {
                throw new IllegalArgumentException(GENERATE_LIMIT_EXCEEDED);
            }
        }
        if (generateCount == MAX_GENERATE_LIMIT - 1) {
            trainer.setLastGenerateTime(LocalDateTime.now());
        }

        Type type1 = Type.fromString(requestBody.getType1());
        Type type2 = Type.fromString(requestBody.getType2()); // nullable 값

        int attack = getRandomInRange(MIN_BASE, MAX_BASE);
        int specialAttack = getRandomInRange(MIN_BASE, MAX_BASE);
        DamageClass damageClass = (attack >= specialAttack) ? DamageClass.PHYSICAL : DamageClass.SPECIAL;
        DamageClass altClass = damageClass.getOppositeClass();

        /*
            1. BE서버에서는 image를 null처리하여 임시 저장
            2. 이미지 생성에 필요한 정보 DB 생성 (id, type1, type2, description)
            3. AI서버에서 2번 DB를 읽고 이미지 생성, DB 저장 + GDS 저장
        */
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
                .skillId3(skillService.getSkillId(type2, damageClass, MIN_DAMAGE, MID_DAMAGE))
                .skillId4(skillService.getSkillId(type2, altClass, MIN_DAMAGE, MID_DAMAGE))
                .build();
        log.info("커켓몬 생성, id={}, description={}", monster.getId(), monster.getDescription());

        trainer.addMonster(monster);
        monsterRepository.save(monster);
        promptService.save(monster.getId(), type1, type2, requestBody.getDescription());

        return monster.getId();
    }

    @Transactional
    public void naming(String trainerName, Integer monsterId, String monsterName) {
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException(MONSTER_NOT_FOUND));

        if (!isYourMonster(trainerName, monster)) {
            throw new IllegalArgumentException(MONSTER_INVALID_OWNER);
        }

        monster.changeNameTo(monsterName);
        monsterRepository.save(monster);
        log.info("커켓몬 이름 지정 name={}", monster.getName());
    }

    @Transactional
    public void release(String trainerName, Integer monsterId) {
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException(MONSTER_NOT_FOUND));

        if (!isYourMonster(trainerName, monster)) {
            throw new IllegalArgumentException(MONSTER_INVALID_OWNER);
        }

        monsterRepository.delete(monster);
        log.info("커켓몬 놓아주기 name={}", monster.getName());
    }

    @Transactional
    public void feed(String trainerName, Integer monsterId) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException(MONSTER_NOT_FOUND));

        if (!isYourMonster(trainerName, monster)) {
            throw new IllegalArgumentException(MONSTER_INVALID_OWNER);
        }

        try {
            trainer.getFeed().decrease(FEED_MINUS);
            monster.increaseSpeed(monster.getAffinity().increase(AFFINITY_PLUS));
            trainerRepository.save(trainer);
            monsterRepository.save(monster);
            log.info("커켓몬 먹이주기 trainer={}, monster={}", trainerName, monster.getName());
        } catch (Exception e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    @Transactional
    public void play(String trainerName, Integer monsterId) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException(MONSTER_NOT_FOUND));

        if (!isYourMonster(trainerName, monster)) {
            throw new IllegalArgumentException(MONSTER_INVALID_OWNER);
        }

        try {
            trainer.getToy().decrease(TOY_MINUS);
            monster.increaseSpeed(monster.getAffinity().increase(AFFINITY_PLUS));
            trainerRepository.save(trainer);
            monsterRepository.save(monster);
            log.info("커켓몬 놀아주기 trainer={}, monster={}", trainerName, monster.getName());

        } catch (Exception e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    @Transactional
    public MonsterDTO.MonsterInfo getMonsterInfo(Integer monsterId) {
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException(MONSTER_NOT_FOUND));

        return new MonsterInfo(
                monster.getId(),
                monster.getName(), monster.getImage(),
                monster.getAffinity().getCount()
        );
    }

    @Transactional
    public MonsterDTO.MonsterBattleInfo getMonsterBattleInfo(Integer monsterId) {
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new IllegalArgumentException(MONSTER_NOT_FOUND));

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

    private boolean isYourMonster(String trainerName, Monster monster) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        return trainer.getMonsters().contains(monster);
    }

    private boolean isOver24Hours(LocalDateTime last) {
        if (last == null) {
            return true;
        }
        return last.isBefore(LocalDateTime.now().minusHours(24));
    }

}
