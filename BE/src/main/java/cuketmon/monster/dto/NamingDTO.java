package cuketmon.monster.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class NamingDTO {

    @Size(max = 15, message = "이름은 15자 이내여야 합니다.")
    private String name;

}
