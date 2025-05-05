package cuketmon.skill.repository;

import cuketmon.damageclass.DamageClass;
import cuketmon.skill.entity.Skill;
import cuketmon.type.Type;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Integer> {

    Optional<List<Skill>> findAllByTypeAndDamageClassAndPowerBetween(
            Type type, DamageClass damageClass, int startDamage, int endDamage);

    @Query(value = "SELECT * FROM skill ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Skill findAnyRandomSkill();

}
