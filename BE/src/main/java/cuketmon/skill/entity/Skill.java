package cuketmon.skill.entity;

import cuketmon.damageclass.DamageClass;
import cuketmon.type.Type;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Skill {

    @Id
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Enumerated(EnumType.STRING)
    @Column
    private DamageClass damageClass;

    @Column(nullable = true)
    private Integer accuracy;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private Integer power;

    @Column(nullable = false)
    private Integer pp;

}
