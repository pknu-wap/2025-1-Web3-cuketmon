package cuketmon.trainer.embeddable;

import static cuketmon.constant.message.ErrorMessages.FEED_INVALID_AMOUNT;
import static cuketmon.trainer.constant.TrainerConst.INIT_FEED_COUNT;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Getter
@Embeddable
public class Feed {

    private Integer count;

    public Feed() {
        this.count = INIT_FEED_COUNT;
    }

    public int decrease(int amount) {
        if (!validate(amount)) {
            throw new IllegalArgumentException(FEED_INVALID_AMOUNT);
        }
        return this.count -= amount;
    }

    public void increase(int amount) {
        this.count += amount;
    }

    private boolean validate(int amount) {
        return this.count >= amount;
    }

}
