package cuketmon.monster.embeddable;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class AffinityTest {

    @Test
    void 친밀도_증가_테스트_스피드_증가_없는_경우() {
        Affinity affinity = new Affinity();

        int result = affinity.increase(10);

        assertEquals(40, affinity.getCount());
        assertEquals(0, result);
    }

    @Test
    void 친밀도_증가_테스트_스피드_증가_있는_경우() {
        Affinity affinity = new Affinity();

        int result = affinity.increase(80);

        assertEquals(110, affinity.getCount());
        assertEquals(1, result);
    }

}
