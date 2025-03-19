package cuketmon.skill.entity;

import cuketmon.type.Type;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

    @Column(nullable = false)
    private Type type;

    @Column
    private String damageClass;

    @Column(nullable = true)
    private Integer accuracy;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private Integer power;

    @Column(nullable = false)
    private Integer pp;

}
