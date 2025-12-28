package cuketmon.type;

import static cuketmon.constant.type.TypeConst.HIGH;
import static cuketmon.constant.type.TypeConst.LOW;
import static cuketmon.constant.type.TypeConst.MID;
import static cuketmon.constant.type.TypeConst.NONE;
import static cuketmon.constant.type.TypeDamageTable.getDamageMultiplier;
import static org.junit.jupiter.api.Assertions.assertEquals;

import cuketmon.constant.type.Type;
import org.junit.jupiter.api.Test;

class TypeDamageTableTest {

    @Test
    void 타입별_데미지_테스트() {
        assertEquals(HIGH, getDamageMultiplier(Type.FIRE, Type.GRASS));
        assertEquals(LOW, getDamageMultiplier(Type.GRASS, Type.FIRE));
        assertEquals(HIGH, getDamageMultiplier(Type.FAIRY, Type.DRAGON));
        assertEquals(MID, getDamageMultiplier(Type.NORMAL, Type.NORMAL));
        assertEquals(NONE, getDamageMultiplier(Type.GHOST, Type.NORMAL));
    }

}
