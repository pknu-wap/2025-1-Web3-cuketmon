package cuketmon.embeddable;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Getter
@Embeddable
public class Feed {

    private Integer count;

    public Feed() {
        this.count = 100;
    }

    public int decrease(int amount) {
        if (!validate(amount)) {
            throw new IllegalArgumentException("[ERROR] 먹이가 부족합니다.");
        }
        return this.count -= amount;
    }

    private boolean validate(int amount) {
        return this.count >= amount;
    }

}
