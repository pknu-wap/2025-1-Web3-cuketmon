package cuketmon.battle.entity;

import cuketmon.battle.constant.BattleResult;
import cuketmon.battle.constant.BattleStatus;
import cuketmon.trainer.entity.Trainer;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Battle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Trainer trainer1;

    @ManyToOne
    private Trainer trainer2;

    @Enumerated(EnumType.STRING)
    private BattleStatus status;

    @Enumerated(EnumType.STRING)
    private BattleResult result;

    public Battle(Trainer trainer1, Trainer trainer2, BattleStatus status) {
        this.trainer1 = trainer1;
        this.trainer2 = trainer2;
        this.status = status;
    }
}
