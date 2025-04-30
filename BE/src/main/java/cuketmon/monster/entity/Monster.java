package cuketmon.monster.entity;

import cuketmon.damageclass.DamageClass;
import cuketmon.type.Type;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String name;

    // AI와의 연결은 여기 예상
    @Column(nullable = true)
    private String image;

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
    private Type type1;

    private Type type2;

    // 스킬 (4개)
    private Integer skillId1;

    private Integer skillId2;

    private Integer skillId3;

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

    // TODO: 수정 필요...
    public Monster(String name, String image, Integer affinity, Integer hp, Integer speed,
                   Integer attack, Integer defence, Integer specialAttack, Integer specialDefence,
                   Type type1, Type type2, Integer skillId1, Integer skillId2, Integer skillId3, Integer skillId4) {
        this.name = name;
        this.image = image;
        this.affinity = affinity;
        this.hp = hp;
        this.speed = speed;
        this.attack = attack;
        this.defence = defence;
        this.specialAttack = specialAttack;
        this.specialDefence = specialDefence;
        this.type1 = type1;
        this.type2 = type2;
        this.skillId1 = skillId1;
        this.skillId2 = skillId2;
        this.skillId3 = skillId3;
        this.skillId4 = skillId4;
    }

}
