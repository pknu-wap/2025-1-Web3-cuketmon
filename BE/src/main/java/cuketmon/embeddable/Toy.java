package cuketmon.embeddable;

import jakarta.persistence.Embeddable;

@Embeddable
public class Toy {

    private Integer count;

    public Toy() {
        this.count = 100;
    }

    // TODO: 여기서 줄어든 값을 리턴해주면 좋을듯?
    //  그럼 프론트에서 먹이를 줬다는 이유로 다시 load할 필요가 없음
    public int decrease(int amount) {
        if (!validate(amount)) {
            throw new IllegalArgumentException("[ERROR] 장난감이 부족합니다.");
        }
        return this.count -= amount;
    }

    private boolean validate(int amount) {
        return this.count >= amount;
    }

}
