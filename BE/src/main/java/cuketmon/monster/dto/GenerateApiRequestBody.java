package cuketmon.monster.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor // 기본 생성자 필수
@AllArgsConstructor // 모든 필드를 포함한 생성자 추가 (필요하면 사용)
public class GenerateApiRequestBody {

    @NotBlank(message = "type1은 필수 입력값입니다.")
    private String type1;

    private String type2;

    @Size(max = 1000, message = "특징은 1000자 이내여야 합니다.")
    private String feature;
}