package cuketmon.trainer.service;

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
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));

        return trainer.getToy().getCount();
    }

    @Transactional
    public Integer getRemainingFeeds(String name) {
        log.info("잔여 먹이 조회 요청: {}", name);
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));

        return trainer.getFeed().getCount();
    }

    @Transactional
    public void addWin(String name) {
        log.info("승리 추가 요청: {}", name);
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));

        trainer.addWin();
    }

    @Transactional
    public List<Trainer> getTop5TrainersByWin() {
        return trainerRepository.findTop5ByOrderByWinDesc();
    }

    //랭킹 시스템
    @Transactional
    public List<TrainerDTO> getTrainerRanking() {
        List<Trainer> sortedTrainers = trainerRepository.findAllByOrderByWinDesc();

        List<TrainerDTO> rankingList = new ArrayList<>();
        int rank = 1;

        for (Trainer trainer : sortedTrainers) {
            rankingList.add(new TrainerDTO(rank, trainer.getName(), trainer.getWin()));
            rank++;
        }

        return rankingList;
    }

    public List<Integer> getMonsterIds(String trainerName) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));

        return trainer.getMonsters().stream()
                .map(Monster::getId)
                .toList();
    }

}
