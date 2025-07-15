package cuketmon.prompt.entity;

import cuketmon.constant.type.Type;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Prompt {

    @Id
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column
    private Type type1;

    @Enumerated(EnumType.STRING)
    @Column
    private Type type2;

    @Column
    private String description;

}
