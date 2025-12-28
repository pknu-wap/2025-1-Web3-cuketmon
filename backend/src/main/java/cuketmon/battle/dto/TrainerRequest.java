package cuketmon.battle.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TrainerRequest {

    private String trainerName;
    private Integer monsterId;

}
