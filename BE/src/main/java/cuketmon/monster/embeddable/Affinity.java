package cuketmon.monster.embeddable;

import static cuketmon.monster.constant.MonsterConst.BOUND;

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
        if (this.count >= BOUND) {
            this.count %= BOUND;
            return 1;
        }
        return 0;
    }

}
