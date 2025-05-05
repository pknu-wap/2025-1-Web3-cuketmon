package cuketmon.prompt.service;

import cuketmon.prompt.entity.Prompt;
import cuketmon.prompt.repository.PromptRepository;
import cuketmon.type.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromptService {

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
    }

}
