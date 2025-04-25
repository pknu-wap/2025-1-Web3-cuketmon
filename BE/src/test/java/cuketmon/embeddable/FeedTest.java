package cuketmon.embeddable;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class FeedTest {

    @Test
    void 먹이_차감_테스트() {
        Feed feed = new Feed();

        int remains = feed.decrease(1);
        assertEquals(99, remains);

        remains = feed.decrease(1);
        assertEquals(98, remains);
    }

    @Test
    void 먹이_차감_오류_테스트() {
        Feed feed = new Feed();

        assertThrows(IllegalArgumentException.class, () -> {
            feed.decrease(101);
        });
    }

}