package cuketmon.trainer.entity;

import cuketmon.monster.entity.Monster;
import cuketmon.trainer.embeddable.Feed;
import cuketmon.trainer.embeddable.Toy;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Trainer {

    @Id
    private String name;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "count", column = @Column(name = "toy", nullable = false))
    })
    private Toy toy;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "count", column = @Column(name = "feed", nullable = false))
    })
    private Feed feed;

    @Column(nullable = false)
    private Integer win;

    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Monster> monsters = new ArrayList<>();

    public void addWin() {
        win += 1;
    }

    public void addMonster(Monster monster) {
        monsters.add(monster);
        monster.setTrainer(this);
    }

}
