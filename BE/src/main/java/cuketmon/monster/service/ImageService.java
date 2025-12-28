package cuketmon.monster.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class ImageService {

    private final WebClient webClient;
    private final S3Client s3Client;
    private final String bucket;
    private final String publicBaseUrl; // 선택: 리전별 URL 정교화 하고 싶으면

    public ImageService(S3Client s3Client,
                        @Value("${stability.api-key}") String apiKey,
                        @Value("${cloud.aws.s3.bucket}") String bucket) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.stability.ai")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
        this.s3Client = s3Client;
        this.bucket = bucket;
        this.publicBaseUrl = "https://" + bucket + ".s3.ap-northeast-2.amazonaws.com/";
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

        String key = "monsters/" + UUID.randomUUID() + ".png";
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType("image/png")
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(pngBytes));

        return publicBaseUrl + key;
    }

}
