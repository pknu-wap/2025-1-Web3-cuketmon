package cuketmon.skill.entity;

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

    // TODO: 타입은 개발 전 이니까 일단 String으로 받아놓기
    @Column(nullable = false)
    private String type;

    @Column(nullable = true)
    private Integer accuracy;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private Integer power;

    @Column(nullable = false)
    private Integer pp;

}
