package cuketmon.trainer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
//@Entity
public class Trainer {

    private String name;
    private long kakaoId;

    public Trainer(String name, String kakaoId) {
        this.name = name;
        this.kakaoId = Long.parseLong(kakaoId);
    }

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
