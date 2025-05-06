package cuketmon.trainer.embeddable;

import static cuketmon.constant.message.ErrorMessages.FEED_INVALID_AMOUNT;

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
            throw new IllegalArgumentException(FEED_INVALID_AMOUNT);
        }
        return this.count -= amount;
    }

    private boolean validate(int amount) {
        return this.count >= amount;
    }

}
