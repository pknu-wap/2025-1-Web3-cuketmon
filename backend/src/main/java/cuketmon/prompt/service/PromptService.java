package cuketmon.prompt.service;

import cuketmon.constant.type.Type;
import cuketmon.prompt.entity.Prompt;
import cuketmon.prompt.repository.PromptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PromptService {

    private final PromptRepository promptRepository;

    public void save(Integer id, Type type1, Type type2, String description) {
        Prompt prompt = Prompt.builder()
                .id(id)
                .type1(type1)
                .type2(type2)
                .description(description)
                .build();

        promptRepository.save(prompt);
        log.info("커켓몬 프롬프트 생성, id={}, description={}", id, description);
    }

    public Integer makeEta() {
        return Long.valueOf(promptRepository.count()).intValue();
    }

}
