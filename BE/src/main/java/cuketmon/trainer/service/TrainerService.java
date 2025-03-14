package cuketmon.trainer.service;

import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TrainerService {

    public static final int INIT_TOY = 100;
    public static final int INIT_FEED = 100;
    public static final int INIT_WIN = 0;

    private final TrainerRepository trainerRepository;

    @Autowired
    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    // 임시 로그인 기능임
    @Transactional
    public void tempLogin(String name) {
        if (!trainerRepository.existsById(name)) {
            Trainer trainer = new Trainer(name, INIT_TOY, INIT_FEED, INIT_WIN);
            trainerRepository.save(trainer);
        }
    }

    @Transactional
    public Integer getRemainingToys(String name) {
        Trainer trainer = trainerRepository.findById(name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR]: 해당 트레이너를 찾을 수 없습니다."));
        return trainer.getToy();
    }


}
