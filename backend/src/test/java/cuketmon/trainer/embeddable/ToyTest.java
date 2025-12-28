package cuketmon.trainer.embeddable;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class ToyTest {

    @Test
    void 장난감_차감_테스트() {
        Toy toy = new Toy();

        int prev = toy.getCount();
        int remains = toy.decrease(1);

        assertEquals(prev - 1, remains);
    }

    @Test
    void 장난감_차감_오류_테스트() {
        Toy toy = new Toy();

        int maxToyCount = toy.getCount();

        assertThrows(IllegalArgumentException.class, () -> {
            toy.decrease(maxToyCount + 1);
        });
    }

}
