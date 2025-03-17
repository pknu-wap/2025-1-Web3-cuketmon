package cuketmon.trainer.repository;

import cuketmon.trainer.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, String> {
    Optional<Trainer> findByKakaoId(String kakaoId);
    //Optional<Trainer> findBYEmail(String email);

    boolean existsBykakaoId(String name);
}
