package io.github.pedrozaz.whentaken.backend.service;

import io.github.pedrozaz.whentaken.backend.model.RoundData;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoundProviderService {

    private final ObjectMapper objectMapper;
    private final List<RoundData> allRounds = new ArrayList<>();

    @PostConstruct
    public void loadRounds() {
        try {
            log.info("Loading rounds");
            ClassPathResource resource = new ClassPathResource("rounds_data.json");

            if (!resource.exists()) {
                log.error("Rounds data not found");
                return;
            }

            List<RoundData> loaded = objectMapper.readValue(
                    resource.getInputStream(),
                    new TypeReference<List<RoundData>>() {}
            );

            allRounds.addAll(loaded);
            log.info("{} rounds loaded in memory.", allRounds.size());
        } catch (IOException e) {
            log.error("Failed to load rounds", e);
        }
    }

    public List<RoundData> getRandomRounds(int count) {
        if (allRounds.isEmpty()) {
            log.warn("No rounds loaded");
            return getFallbackRounds();
        }

        List<RoundData> shuffled = new ArrayList<>(allRounds);
        Collections.shuffle(shuffled);
        return  shuffled.subList(0, Math.min(count, shuffled.size()));
    }

    private List<RoundData> getFallbackRounds() {
        return List.of(
                new RoundData("https://upload.wikimedia.org/wikipedia/commons/a/af/Eiffel_Tower_1900_01.jpg", 48.8584, 2.2945, 1900),
                new RoundData("https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg", 40.7484, -73.9857, 1931)
        );
    }
}