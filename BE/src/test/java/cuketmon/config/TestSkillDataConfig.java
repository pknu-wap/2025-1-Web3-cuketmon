package cuketmon.config;

import cuketmon.constant.damageclass.DamageClass;
import cuketmon.constant.type.Type;
import cuketmon.skill.entity.Skill;
import cuketmon.skill.repository.SkillRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestSkillDataConfig {

    @Bean
    public SkillDataInitializer skillDataInitializer(SkillRepository skillRepository) {
        return new SkillDataInitializer(skillRepository);
    }

    public static class SkillDataInitializer {

        private final SkillRepository skillRepository;

        public SkillDataInitializer(SkillRepository skillRepository) {
            this.skillRepository = skillRepository;
        }

        @PostConstruct
        public void initSkills() {
            skillRepository.save(new Skill(1, Type.WATER, DamageClass.SPECIAL, 100, "aqua-jet", "한국어", 40, 20, 0));
            skillRepository.save(new Skill(2, Type.WATER, DamageClass.SPECIAL, 80, "hydro-pump", "한국어", 90, 10, 0));

            skillRepository.save(new Skill(3, Type.GRASS, DamageClass.SPECIAL, 100, "razor-leaf", "한국어", 55, 25, 0));
            skillRepository.save(new Skill(4, Type.GRASS, DamageClass.SPECIAL, 100, "solar-beam", "한국어", 120, 10, 0));

            skillRepository.save(new Skill(5, Type.FIRE, DamageClass.SPECIAL, 100, "ember", "한국어", 40, 25, 0));
            skillRepository.save(new Skill(6, Type.FIRE, DamageClass.SPECIAL, 100, "flamethrower", "한국어", 90, 15, 0));

            skillRepository.save(new Skill(7, Type.ICE, DamageClass.SPECIAL, 100, "ice-beam", "한국어", 90, 10, 0));
            skillRepository.save(new Skill(8, Type.ICE, DamageClass.SPECIAL, 70, "blizzard", "한국어", 110, 5, 0));

            skillRepository.save(new Skill(9, Type.PSYCHIC, DamageClass.SPECIAL, 100, "psybeam", "한국어", 65, 20, 0));
            skillRepository.save(new Skill(10, Type.PSYCHIC, DamageClass.SPECIAL, 100, "psychic", "한국어", 90, 10, 0));

            skillRepository.save(new Skill(11, Type.FLYING, DamageClass.SPECIAL, 95, "air-slash", "한국어", 75, 15, 0));
            skillRepository.save(new Skill(12, Type.FLYING, DamageClass.SPECIAL, 100, "gust", "한국어", 40, 35, 0));

            skillRepository.save(new Skill(13, Type.GHOST, DamageClass.SPECIAL, 100, "shadow-ball", "한국어", 80, 15, 0));
            skillRepository.save(new Skill(14, Type.GHOST, DamageClass.SPECIAL, 100, "hex", "한국어", 65, 10, 0));

            skillRepository.save(
                    new Skill(15, Type.ELECTRIC, DamageClass.SPECIAL, 100, "thunderbolt", "한국어", 90, 15, 0));
            skillRepository.save(new Skill(16, Type.ELECTRIC, DamageClass.SPECIAL, 100, "spark", "한국어", 65, 20, 0));

            skillRepository.save(
                    new Skill(17, Type.DRAGON, DamageClass.SPECIAL, 100, "dragon-pulse", "한국어", 85, 10, 0));
            skillRepository.save(new Skill(18, Type.DRAGON, DamageClass.SPECIAL, 90, "draco-meteor", "한국어", 130, 5, 0));

            skillRepository.save(new Skill(19, Type.POISON, DamageClass.SPECIAL, 100, "sludge-bomb", "한국어", 90, 10, 0));
            skillRepository.save(new Skill(20, Type.POISON, DamageClass.SPECIAL, 100, "acid", "한국어", 40, 30, 0));

            skillRepository.save(new Skill(21, Type.NORMAL, DamageClass.SPECIAL, 100, "hyper-voice", "한국어", 90, 10, 0));
            skillRepository.save(new Skill(22, Type.NORMAL, DamageClass.SPECIAL, 100, "round", "한국어", 60, 15, 0));

            skillRepository.save(new Skill(23, Type.STEEL, DamageClass.SPECIAL, 100, "flash-cannon", "한국어", 80, 10, 0));
            skillRepository.save(new Skill(24, Type.STEEL, DamageClass.SPECIAL, 90, "mirror-shot", "한국어", 65, 10, 0));

            skillRepository.save(new Skill(25, Type.FAIRY, DamageClass.SPECIAL, 100, "moonblast", "한국어", 95, 15, 0));
            skillRepository.save(
                    new Skill(26, Type.FAIRY, DamageClass.SPECIAL, 100, "dazzling-gleam", "한국어", 80, 10, 0));

            skillRepository.save(new Skill(27, Type.BUG, DamageClass.SPECIAL, 100, "bug-buzz", "한국어", 90, 10, 0));
            skillRepository.save(new Skill(28, Type.BUG, DamageClass.SPECIAL, 100, "signal-beam", "한국어", 75, 15, 0));

            skillRepository.save(new Skill(29, Type.ROCK, DamageClass.SPECIAL, 100, "power-gem", "한국어", 80, 20, 0));
            skillRepository.save(new Skill(30, Type.ROCK, DamageClass.SPECIAL, 90, "ancient-power", "한국어", 60, 5, 0));

            skillRepository.save(new Skill(31, Type.GROUND, DamageClass.SPECIAL, 100, "earth-power", "한국어", 90, 10, 0));
            skillRepository.save(new Skill(32, Type.GROUND, DamageClass.SPECIAL, 85, "mud-shot", "한국어", 55, 15, 0));

            skillRepository.save(new Skill(33, Type.DARK, DamageClass.SPECIAL, 100, "dark-pulse", "한국어", 80, 15, 0));
            skillRepository.save(new Skill(34, Type.DARK, DamageClass.SPECIAL, 100, "fiery-wrath", "한국어", 90, 10, 0));

            skillRepository.save(
                    new Skill(35, Type.FIGHTING, DamageClass.SPECIAL, 100, "aura-sphere", "한국어", 80, 20, 0));
            skillRepository.save(
                    new Skill(36, Type.FIGHTING, DamageClass.SPECIAL, 70, "focus-blast", "한국어", 120, 5, 0));
        }
    }

}
