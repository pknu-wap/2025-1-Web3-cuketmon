package cuketmon.trainer.entity;

import cuketmon.trainer.embeddable.Feed;
import cuketmon.trainer.embeddable.Toy;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
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

    public void addWin() {
        win = win + 1;
    }

}
