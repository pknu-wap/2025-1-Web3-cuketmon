package cuketmon.monster.repository;

import cuketmon.monster.entity.Monster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonsterRepository extends JpaRepository<Monster, String> {
}
