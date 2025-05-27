package cuketmon.trainer.repository;

import cuketmon.trainer.entity.Trainer;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface TrainerRepository extends JpaRepository<Trainer, String> {

    Optional<Trainer> findByName(String name);

    Optional<String> findRefreshTokenByName(String name);

    int countByWinGreaterThan(int win);

    @Modifying
    @Query("UPDATE Trainer t SET t.refreshToken = :refreshToken WHERE t.name = :trainerName")
    void updateRefreshToken(@Param("trainerName") String trainerName,
                            @Param("refreshToken") String refreshToken);

}
