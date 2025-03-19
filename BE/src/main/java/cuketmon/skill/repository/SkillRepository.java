package cuketmon.skill.repository;

import cuketmon.skill.entity.Skill;
import cuketmon.type.Type;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Integer> {

    Optional<List<Skill>> findAllByTypeAndDamageClassAndPowerBetween(
            Type type, String damageClass, int startDamage, int endDamage);

}
