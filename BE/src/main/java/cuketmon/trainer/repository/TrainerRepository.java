package cuketmon.trainer.repository;

import cuketmon.trainer.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, String> {

    Optional<Trainer> findByKakaoId(String kakaoId);
    //Optional<Trainer> findBYEmail(String email);


        // 승리 횟수(WIN) 기준 내림차순 정렬하여 전체 Trainer 랭킹 조회
        @Query("SELECT t FROM Trainer t ORDER BY t.win DESC")
        List<Trainer> findAllByWinDesc();

        // 특정 Trainer의 현재 랭킹 조회
        @Query("SELECT COUNT(t) + 1 FROM Trainer t WHERE t.win > (SELECT win FROM Trainer WHERE kakaoId = :kakaoId)")
        int findTrainerRanking(@Param("kakaoId") String kakaoId);

    public interface UserRepository extends JpaRepository<Trainer, Long> {
        Optional<Trainer> findByKakaoId(Long kakaoId); // 카카오 ID로 사용자 조회
    }

    boolean existsBykakaoId(String name);
    boolean existsByKakaoId(String kakaoId);
}
