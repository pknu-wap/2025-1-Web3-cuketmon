package cuketmon.monster.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class NamingDTO {

    @NotBlank(message = "이름은 필수 입력값입니다.")
    @Size(min = 2, max = 15, message = "이름은 2자 이상 15자 이하여야 합니다.")
    private String name;

}
