package cuketmon.trainer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TrainerDTO {

    private int rank;
    private String trainerName;
    private int win;
    private int lose;
    private int allBattles;

}
