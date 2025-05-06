package cuketmon.trainer.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class TrainerDTO {

    //Get
   private int rank;
//    private String name;
    private int win;
    private int lose;
    private int allBattles;

    //Request
    private String trainerName;
}
