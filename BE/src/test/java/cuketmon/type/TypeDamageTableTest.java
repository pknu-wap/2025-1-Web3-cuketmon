package cuketmon.type;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class TypeDamageTableTest {

    @Test
    void 타입별_데미지_테스트() {
        TypeDamageTable typeDamageTable = new TypeDamageTable();
        assertEquals(2.0, typeDamageTable.getDamageMultiplier(Type.FIRE, Type.GRASS));
        assertEquals(0.5, typeDamageTable.getDamageMultiplier(Type.GRASS, Type.FIRE));
        assertEquals(2.0, typeDamageTable.getDamageMultiplier(Type.FAIRY, Type.DRAGON));
        assertEquals(1.0, typeDamageTable.getDamageMultiplier(Type.NORMAL, Type.NORMAL));
        assertEquals(0.0, typeDamageTable.getDamageMultiplier(Type.GHOST, Type.NORMAL));
    }

}