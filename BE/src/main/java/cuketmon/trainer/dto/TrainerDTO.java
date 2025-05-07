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
    //Dto trainer name 빼는 방향

    private int rank;
    private String trainerName;
    private int win;
    private int lose;
    private int allBattles;

    //public TrainerDTO(int i, String name, Integer win, Integer lose, Integer allBattles) { }
}
