package cuketmon.trainer.embeddable;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class FeedTest {

    @Test
    void 먹이_차감_테스트() {
        Feed feed = new Feed();

        int prev = feed.getCount();
        int remains = feed.decrease(1);

        assertEquals(prev - 1, remains);
    }

    @Test
    void 먹이_차감_오류_테스트() {
        Feed feed = new Feed();

        int maxFeedCount = feed.getCount();

        assertThrows(IllegalArgumentException.class, () -> {
            feed.decrease(maxFeedCount + 1);
        });
    }

}
