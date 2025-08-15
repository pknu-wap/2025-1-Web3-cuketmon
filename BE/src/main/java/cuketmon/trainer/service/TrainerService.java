package cuketmon.trainer.service;

import static cuketmon.constant.message.ErrorMessages.TRAINER_NOT_FOUND;
import static cuketmon.util.Random.getRandomInRange;

import cuketmon.monster.entity.Monster;
import cuketmon.trainer.dto.TrainerDTO;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import cuketmon.util.CustomLogger;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private static final Logger log = CustomLogger.getLogger(TrainerService.class);

    private final TrainerRepository trainerRepository;

    @Transactional
    public Integer getRemainingToys(String name) {
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        log.info("장난감 조회: {}", name);
        return trainer.getToy().getCount();
    }

    @Transactional
    public Integer getRemainingFeeds(String name) {
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        log.info("먹이 조회  : {}", name);
        return trainer.getFeed().getCount();
    }

    @Transactional
    public void addWin(String name) {
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        log.info("승리 추가: {}", name);
        trainer.addWin();
        trainer.getFeed().increase(getRandomInRange(1, 3));
        trainer.getToy().increase(getRandomInRange(1, 3));
    }

    @Transactional
    public void addLose(String name) {
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        log.info("패배 추가: {}", name);
        trainer.addLose();
    }

    // 랭킹 시스템
    @Transactional
    public TrainerDTO getSingleRanking(String trainerName) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        return new TrainerDTO(
                trainerRepository.countByWinGreaterThan(trainer.getWin()) + 1,
                trainer.getName(),
                trainer.getWin(),
                trainer.getLose(),
                trainer.getAllBattles()
        );
    }

    public List<Integer> getMonsterIds(String trainerName) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        return trainer.getMonsters().stream()
                .map(Monster::getId)
                .toList();
    }

}
