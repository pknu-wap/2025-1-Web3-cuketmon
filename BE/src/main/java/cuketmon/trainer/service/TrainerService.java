package cuketmon.trainer.service;

import static cuketmon.constant.message.ErrorMessages.TRAINER_NOT_FOUND;

import cuketmon.monster.entity.Monster;
import cuketmon.trainer.dto.TrainerDTO;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import cuketmon.util.CustomLogger;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TrainerService {

    private static final Logger log = CustomLogger.getLogger(TrainerService.class);

    private final TrainerRepository trainerRepository;

    @Autowired
    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    @Transactional
    public Integer getRemainingToys(String name) {
        log.info("잔여 장난감 조회 요청: {}", name);
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        return trainer.getToy().getCount();
    }

    @Transactional
    public Integer getRemainingFeeds(String name) {
        log.info("잔여 먹이 조회 요청: {}", name);
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        return trainer.getFeed().getCount();
    }

    @Transactional
    public void addWin(String name) {
        log.info("승리 추가 요청: {}", name);
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        trainer.addWin();
    }

    @Transactional
    public void addLose(String name) {
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        trainer.addLose();
    }

    // 랭킹 시스템
    // 트레이너 전체 랭킹
    @Transactional
    public List<TrainerDTO> getAllRanking() {
        List<Trainer> sorted = trainerRepository.findAllByOrderByWinDesc();

        List<TrainerDTO> rankingList = new ArrayList<>();

        int rank = 1;
        for (Trainer trainer : sorted) {
            rankingList.add(new TrainerDTO(
                            rank++,
                            trainer.getName(),
                            trainer.getWin(),
                            trainer.getLose(),
                            trainer.getAllBattles()
                    )
            );
        }
        return rankingList;
    }

    // 트레이너 개인 랭킹
    @Transactional
    public TrainerDTO getSingleRanking(String trainerName) {
        List<Trainer> sorted = trainerRepository.findAllByOrderByWinDesc();

        int rank = 1;
        for (Trainer trainer : sorted) {
            if (trainer.getName().equals(trainerName)) {
                return new TrainerDTO(
                        rank,
                        trainer.getName(),
                        trainer.getWin(),
                        trainer.getLose(),
                        trainer.getAllBattles()
                );
            }
            rank++;
        }
        throw new IllegalArgumentException(TRAINER_NOT_FOUND);
    }

    public List<Integer> getMonsterIds(String trainerName) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException(TRAINER_NOT_FOUND));

        return trainer.getMonsters().stream()
                .map(Monster::getId)
                .toList();
    }

}
