package cuketmon.trainer.service;

import cuketmon.trainer.entity.Trainer;
import cuketmon.trainer.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service

public class TrainerService {

    public static final int INIT_TOY = 100;
    public static final int INIT_FEED = 100;
    public static final int INIT_WIN = 0;

    private final TrainerRepository trainerRepository;

    @Transactional
    public List<Trainer> getTrainerRanking() {
        return trainerRepository.findAllByWinDesc();
    }

    //현재 랭킹 조회
    @Transactional
    public int getTrainerRank(String kakaoId) {
        return trainerRepository.findTrainerRanking(kakaoId);
    }

    @Autowired
    public TrainerService(TrainerRepository trainerRepository, cuketmon.trainer.repository.TrainerRepository trainerRepository1) {

        this.trainerRepository = trainerRepository;
        TrainerRepository = trainerRepository1;
    }

    //카카오톡 로그인 기능
    @Transactional
    public void kakaoLogin(String name, long kakaoId){
        if (!trainerRepository.existsBykakaoId(name)){
            Trainer trainer = new Trainer(name,kakaoId, INIT_TOY, INIT_FEED, INIT_WIN);
            trainerRepository.save(trainer);
        }

    }
    // 임시 로그인 기능임
    @Transactional
    public void tempLogin(String name, long kakaoId) {
        if (!trainerRepository.existsById(name)) {
            Trainer trainer = new Trainer(name, kakaoId, INIT_TOY, INIT_FEED, INIT_WIN);
            trainerRepository.save(trainer);
        }
    }

    private final TrainerRepository TrainerRepository;


    //트레이너 신규 생성
    public Trainer registerOrLogin(String name,String kakaoId) {
        Optional<Trainer> userOptional = TrainerRepository.findByKakaoId(kakaoId);

        if (userOptional.isPresent()) {
            return userOptional.get(); // 기존 회원 반환
        }

        // 새 회원 등록
        Trainer newUser = new Trainer(name, kakaoId);
        return TrainerRepository.save(newUser);
    }

    @Transactional
    public Integer getRemainingToys(String name) {
        Trainer trainer = trainerRepository.findByKakaoId(name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR]: 해당 트레이너를 찾을 수 없습니다."));
        return trainer.getToy();
    }

    @Transactional
    public Integer getRemainingFeeds(String name) {
        Trainer trainer = trainerRepository.findByKakaoId(name)
                .orElseThrow(() -> new IllegalArgumentException("[ERROR]: 해당 트레이너를 찾을 수 없습니다."));
        return trainer.getFeed();
    }




}
