package cuketmon.monster.entity;

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

    /*
    // 타입 (1~2개)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "monster_types", joinColumns = @JoinColumn(name = "pokemon_id"))
    @Enumerated(EnumType.STRING)
    private List<Type> types = new ArrayList<>();

    // 스킬 (4개)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "monster_skills", joinColumns = @JoinColumn(name = "pokemon_id"))
    @Enumerated(EnumType.STRING)
    private List<Skill> skills = new ArrayList<>();
    */

    /*
    특성은.. 나중에...
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "monster_abilities", joinColumns = @JoinColumn(name = "pokemon_id"))
    @Enumerated(EnumType.STRING)
    private List<Ability> abilities = new ArrayList<>();
    */

    public void increaseAffinity(int plus) {
        affinity = affinity + plus;
    }
}
