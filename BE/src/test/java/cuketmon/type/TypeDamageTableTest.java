package cuketmon.type;

import static cuketmon.constant.type.TypeDamageTable.getDamageMultiplier;
import static org.junit.jupiter.api.Assertions.assertEquals;

import cuketmon.constant.type.Type;
import org.junit.jupiter.api.Test;

class TypeDamageTableTest {

    @Test
    void 타입별_데미지_테스트() {
        assertEquals(2.0, getDamageMultiplier(Type.FIRE, Type.GRASS));
        assertEquals(0.5, getDamageMultiplier(Type.GRASS, Type.FIRE));
        assertEquals(2.0, getDamageMultiplier(Type.FAIRY, Type.DRAGON));
        assertEquals(1.0, getDamageMultiplier(Type.NORMAL, Type.NORMAL));
        assertEquals(0.0, getDamageMultiplier(Type.GHOST, Type.NORMAL));
    }

}
