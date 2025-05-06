package cuketmon.trainer.service;

import cuketmon.monster.entity.Monster;
import cuketmon.trainer.dto.TrainerDTO;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TrainerService {

    private final TrainerRepository trainerRepository;

    @Autowired
    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    @Transactional
    public Integer getRemainingToys(String name) {
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));

        return trainer.getToy().getCount();
    }

    @Transactional
    public Integer getRemainingFeeds(String name) {
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));

        return trainer.getFeed().getCount();
    }

    @Transactional
    public void addWin(String name) {
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));

        trainer.addWin();
    }

    @Transactional
    public void addLose(String name) {
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR]: 해당 트레이너를 찾을 수 없습니다."));

        trainer.addLose();
    }

    //랭킹 시스템
    //트레이너 전체 랭킹
    @Transactional
    public List<TrainerDTO> getTrainerRanking() {
        List<Trainer> sorted = trainerRepository.findAllByOrderByWinDesc();

        List<TrainerDTO> rankingList = new ArrayList<>();

        int rank = 1;

        for (Trainer t : sorted) {
            rankingList.add(new TrainerDTO(

                            rank++,
                            t.getName(),
                            t.getWin(),
                            t.getLose(),
                            t.getallBattles()
                    )
            );
        }

        return rankingList;
    }

    //트레이너 개인 랭킹
    @Transactional
    public TrainerDTO getSingleRanking(String trainerName){
        List<Trainer> sorted = trainerRepository.findAllByOrderByWinDesc();

        int rank = 1;
        for(Trainer t : sorted) {
            if(t.getName().equals(trainerName)) {
                return new TrainerDTO(
                        rank,
                        t.getName(),
                        t.getWin(),
                        t.getLose(),
                        t.getallBattles()
                );
            }
            rank++;
        }
        throw new IllegalArgumentException("[ERROR]: 해당 트레이너를 찾을 수 없습니다.");
    }

    public List<Integer> getMonsterIds(String trainerName) {
        Trainer trainer = trainerRepository.findById(trainerName)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR] 해당 트레이너를 찾을 수 없습니다."));

        return trainer.getMonsters().stream()
                .map(Monster::getId)
                .toList();
    }

}
