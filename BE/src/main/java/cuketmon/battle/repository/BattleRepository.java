package cuketmon.battle.repository;

import cuketmon.battle.entity.Battle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BattleRepository extends JpaRepository<Battle, Integer> {
}
