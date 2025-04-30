package cuketmon.monster.entity;

import cuketmon.damageclass.DamageClass;
import cuketmon.type.Type;
import jakarta.persistence.Column;
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

    // AI에서는 base64로 이미지를 입력할 수 있음
    @Column(nullable = true)
    private byte[] image;

    @Column(length = 75)
    private String description;

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
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Type type2;

    // 스킬 (4개)
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

    public void increaseAffinity(int plus) {
        affinity = affinity + plus;
    }

    public DamageClass getDamageClass() {
        return (attack >= specialAttack) ? DamageClass.PHYSICAL : DamageClass.SPECIAL;
    }

}
