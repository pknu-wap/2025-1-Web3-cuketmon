package cuketmon.trainer.entity;

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
public class Trainer {

    @Id
    private String name;

    // TODO: toy, feed 클래스로 생성후 validation 고려 ex) 0~100
    @Column(nullable = false)
    private Integer toy;

    @Column(nullable = false)
    private Integer feed;

    @Column(nullable = false)
    private Integer win;

    public void decreaseToy(int minus) {
        toy = toy - minus;
    }

    public void decreaseFeed(int minus) {
        feed = feed - minus;
    }

}
