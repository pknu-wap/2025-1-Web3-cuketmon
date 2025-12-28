package cuketmon.skill.entity;

import cuketmon.constant.damageclass.DamageClass;
import cuketmon.constant.type.Type;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    @Id
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DamageClass damageClass;

    @Column(nullable = true)
    private Integer accuracy;

    @Column(nullable = false)
    private String englishName;

    @Column(nullable = false)
    private String koreanName;

    @Column(nullable = true)
    private Integer power;

    @Column(nullable = false)
    private Integer pp;

    @Column(nullable = false)
    private Integer priority;

}
