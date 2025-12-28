package cuketmon.trainer.entity;

import static cuketmon.constant.message.ErrorMessages.GENERATE_LIMIT_EXCEEDED;
import static cuketmon.constant.message.ErrorMessages.MONSTER_LIMIT_EXCEEDED;
import static cuketmon.monster.constant.MonsterConst.MAX_GENERATE_LIMIT;
import static cuketmon.monster.constant.MonsterConst.MAX_MONSTER_LIMIT;

import cuketmon.monster.entity.Monster;
import cuketmon.trainer.embeddable.Feed;
import cuketmon.trainer.embeddable.Toy;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Trainer {

    @Id
    private String name;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "count", column = @Column(name = "toy", nullable = false))
    })
    private Toy toy;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "count", column = @Column(name = "feed", nullable = false))
    })
    private Feed feed;

    // 랭킹 시스템
    @Column(nullable = false)
    private Integer win;

    @Column(nullable = false)
    private Integer lose;

    @Column(nullable = false)
    @Builder.Default
    private Integer generateCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private LocalDate lastGenerateDate = LocalDate.now(ZoneId.of("Asia/Seoul"));

    @Column(name = "refresh_token")
    private String refreshToken;

    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Monster> monsters = new ArrayList<>();


    public void addWin() {
        this.win += 1;
    }

    public void addLose() {
        this.lose += 1;
    }

    public Integer getAllBattles() {
        return this.win + this.lose;
    }

    public Integer addGenerateCount() {
        return this.generateCount += 1;
    }

    public LocalDate setLastGenerateDate(LocalDate lastGenerateDate) {
        return this.lastGenerateDate = lastGenerateDate;
    }

    public void initGenerateCount() {
        this.generateCount = 0;
    }

    public void addMonster(Monster monster) {
        monsters.add(monster);
        monster.setTrainer(this);
    }

    public void checkLimits() {
        if (getMonsters().size() >= MAX_MONSTER_LIMIT) {
            throw new IllegalArgumentException(MONSTER_LIMIT_EXCEEDED);
        }

        // 하루가 지났으면 초기화
        if (!getLastGenerateDate().equals(LocalDate.now(ZoneId.of("Asia/Seoul")))) {
            initGenerateCount();
            setLastGenerateDate(LocalDate.now(ZoneId.of("Asia/Seoul")));
        }
        // 일일 최대 커켓몬 생성 제한
        if (addGenerateCount() > MAX_GENERATE_LIMIT) {
            throw new IllegalArgumentException(GENERATE_LIMIT_EXCEEDED);
        }
    }

}
