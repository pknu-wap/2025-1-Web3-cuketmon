package cuketmon.trainer.embeddable;

import static cuketmon.constant.message.ErrorMessages.TOY_INVALID_AMOUNT;
import static cuketmon.trainer.constant.TrainerConst.INIT_TOY_COUNT;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Getter
@Embeddable
public class Toy {

    private Integer count;

    public Toy() {
        this.count = INIT_TOY_COUNT;
    }

    public int decrease(int amount) {
        if (!validate(amount)) {
            throw new IllegalArgumentException(TOY_INVALID_AMOUNT);
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
