package cuketmon.monster.entity;

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
public class Monster {

    @Id
    private String name;

    // AI와의 연결은 여기 예상
    @Column(nullable = true)
    private String image;

    // TODO: 최대값, 종족값 늘려주는 등의 행위 논의 필요
    @Column(nullable = false)
    private Integer affinity;

    // 종족값 (6개)
    @Column(nullable = false)
    private Integer hp;

    @Column(nullable = false)
    private Integer speed;

    @Column(nullable = false)
    private Integer attack;

    @Column(nullable = false)
    private Integer defence;

    @Column(nullable = false)
    private Integer specialAttack;

    @Column(nullable = false)
    private Integer specialDefence;

    // 타입 (1~2개)
    private Type type1;

    private Type type2;

    // 스킬 (4개)
    private Long skillId1;

    private Long skillId2;

    private Long skillId3;

    private Long skillId4;

    /*
    특성은... 나중에...
    private Long abilities;
    */

    public void increaseAffinity(int plus) {
        affinity = affinity + plus;
    }

}
