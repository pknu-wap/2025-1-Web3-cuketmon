package cuketmon.monster.service;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ImageService {

    private final WebClient webClient;

    public ImageService(@Value("${stability.api-key}") String apiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.stability.ai")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
    }

    public String makeImage(String description) {
        String engine = "stable-diffusion-xl-1024-v1-0";
        Map<String, Object> body = Map.of(
                "height", 1024,
                "width", 1024,
                "steps", 30,
                "cfg_scale", 7,
                "samples", 1,
                "text_prompts", List.of(Map.of("text", description))
        );

        byte[] pngBytes = webClient.post()
                .uri("/v1/generation/{engine_id}/text-to-image", engine)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.IMAGE_PNG)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(byte[].class)
                .block();

        if (pngBytes == null || pngBytes.length == 0) {
            throw new IllegalStateException("Stability API returned empty image");
        }

        return "url";
    }

}
