package cuketmon.monster.embeddable;

import static cuketmon.monster.constant.MonsterConst.BOUND;

import jakarta.persistence.Embeddable;

@Embeddable
public class Affinity {

    private Integer count;

    public Affinity() {
        this.count = 30;
    }

    public int increase(int amount) {
        int before = count;
        this.count = before + amount;

        if (this.count / 100 != before / 100) {
            return 1;
        }
        return 0;
    }

    public Integer getCount() {
        return Math.min(count, BOUND);
    }

}
