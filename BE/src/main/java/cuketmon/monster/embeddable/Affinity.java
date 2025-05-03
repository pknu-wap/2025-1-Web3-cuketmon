package cuketmon.monster.embeddable;


import jakarta.persistence.Embeddable;
import lombok.Getter;


@Getter
@Embeddable
public class Affinity {

    private Integer count;

    public Affinity() {
        this.count = 30;
    }

    public int increase(int amount) {
        this.count += amount;
        if (this.count >= 100) {
            this.count %= 100;
            return 1;
        }
        return 0;
    }

}
