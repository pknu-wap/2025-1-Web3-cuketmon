package cuketmon.skill.prompt.service;

import cuketmon.constant.type.Type;
import cuketmon.skill.prompt.entity.Prompt;
import cuketmon.skill.prompt.repository.PromptRepository;
import cuketmon.util.CustomLogger;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromptService {

    private static final Logger log = CustomLogger.getLogger(PromptService.class);

    private final PromptRepository promptRepository;

    @Autowired
    public PromptService(PromptRepository promptRepository) {
        this.promptRepository = promptRepository;
    }

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

}
