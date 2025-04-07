package cuketmon.util;

import java.util.concurrent.ThreadLocalRandom;

public class Random {

    public static int getRandomInRange(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }

}
