package cuketmon.battle.service;

import cuketmon.battle.constant.BattleStatus;
import cuketmon.battle.entity.Battle;
import cuketmon.battle.repository.BattleRepository;
import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BattleService {

    private final BattleRepository battleRepository;
    private final TrainerRepository trainerRepository;

    @Autowired
    public BattleService(BattleRepository battleRepository, TrainerRepository trainerRepository) {
        this.battleRepository = battleRepository;
        this.trainerRepository = trainerRepository;
    }

    @Transactional
    public Integer startBattle(String trainer1Name, String trainer2Name) {
        Trainer trainer1 = trainerRepository.findById(trainer1Name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR]: 해당 트레이너를 찾을 수 없습니다."));
        Trainer trainer2 = trainerRepository.findById(trainer2Name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR]: 해당 트레이너를 찾을 수 없습니다."));

        Battle battle = new Battle(trainer1, trainer2, BattleStatus.WAITING);
        battleRepository.save(battle);

        return battle.getId();
    }

    @Transactional
    public void endBattle(Integer battleId) {
        Battle battle = battleRepository.findById(battleId)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR]: 해당 배틀을 찾을 수 없습니다."));

        battle.setStatus(BattleStatus.FINISHED);
        battleRepository.save(battle);
    }

}
