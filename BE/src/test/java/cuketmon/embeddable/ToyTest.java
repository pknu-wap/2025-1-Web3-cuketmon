package cuketmon.embeddable;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class ToyTest {

    @Test
    void 장난감_차감테스트() {
        Toy toy = new Toy();

        int remains = toy.decrease(1);
        assertEquals(99, remains);

        remains = toy.decrease(1);
        assertEquals(98, remains);
    }

    @Test
    void 장난감_차감_오류_테스트() {
        Toy toy = new Toy();

        assertThrows(IllegalArgumentException.class, () -> {
            toy.decrease(101);
        });
    }

}