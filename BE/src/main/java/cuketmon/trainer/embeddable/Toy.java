package cuketmon.trainer.embeddable;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Getter
@Embeddable
public class Toy {

    private Integer count;

    public Toy() {
        this.count = 100;
    }

    public int decrease(int amount) {
        if (!validate(amount)) {
            throw new IllegalArgumentException("[ERROR] 장난감이 부족합니다.");
        }
        return this.count -= amount;
    }

    private boolean validate(int amount) {
        return this.count >= amount;
    }

}
