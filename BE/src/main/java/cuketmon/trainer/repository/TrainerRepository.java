package cuketmon.trainer.repository;

import cuketmon.trainer.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TrainerRepository extends JpaRepository<Trainer, String> {

    List<Trainer> findAllByOrderByWinDesc(); // 정렬- 트레이너 랭킹

}
