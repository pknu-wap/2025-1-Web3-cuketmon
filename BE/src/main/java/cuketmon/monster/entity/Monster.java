package cuketmon.monster.entity;

import cuketmon.monster.embeddable.Affinity;
import cuketmon.type.Type;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Monster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = true)
    private String name;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String image;

    @Column
    private String description;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "count", column = @Column(name = "affinity", nullable = false))
    })
    private Affinity affinity;

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

    // 타입
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Type type2;

    // 스킬
    @Column(nullable = false)
    private Integer skillId1;

    @Column(nullable = false)
    private Integer skillId2;

    @Column(nullable = true)
    private Integer skillId3;

    @Column(nullable = true)
    private Integer skillId4;

    public void changeNameTo(String name) {
        this.name = name;
    }

    public void increaseSpeed(int amount) {
        this.speed += amount;
    }

}
