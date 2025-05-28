package cuketmon.trainer.repository;

import cuketmon.trainer.entity.Trainer;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface TrainerRepository extends JpaRepository<Trainer, String> {

    Optional<Trainer> findByName(String name);

    @Query("SELECT t.refreshToken FROM Trainer t WHERE t.name = :name")
    Optional<String> findRefreshTokenByName(@Param("name") String name);

    int countByWinGreaterThan(int win);

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Trainer t SET t.refreshToken = :refreshToken WHERE t.name = :trainerName")
    void updateRefreshToken(@Param("trainerName") String trainerName,
                            @Param("refreshToken") String refreshToken);

}
