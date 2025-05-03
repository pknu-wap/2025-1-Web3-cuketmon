package cuketmon.trainer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TrainerDTO {

    private int rank;
    private String name;
    private int win;

}