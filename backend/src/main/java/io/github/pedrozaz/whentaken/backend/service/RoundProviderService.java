package io.github.pedrozaz.whentaken.backend.service;

import io.github.pedrozaz.whentaken.backend.dto.WikiResponse;
import io.github.pedrozaz.whentaken.backend.model.RoundData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RoundProviderService {

    private final RestClient restClient;

    private static final String[] CATEGORIES = {
            "Category:Featured_pictures_of_architecture",
            "Category:Quality_images_of_architecture",
            "Category:Featured_pictures_of_landscapes",
            "Category:Quality_images_of_cities"
    };

    public RoundProviderService(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://commons.wikimedia.org/w/api.php")
                .defaultHeader("User-Agent", "WhenTakenGame (github.com/pedrozaz)")
                .build();
    }

    public List<RoundData> getRandomRounds(int count) {
        List<RoundData> candidates = new ArrayList<>();

        String randomCategory = CATEGORIES[(int) (System.currentTimeMillis() % CATEGORIES.length)];
        try {
            log.info("Searching images on category {}", randomCategory);

            WikiResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("action", "query")
                            .queryParam("generator", "categorymembers")
                            .queryParam("gcmtitle", randomCategory)
                            .queryParam("gcmlimit", "50")
                            .queryParam("gcmrsort", "timestamp")
                            .queryParam("prop", "imageinfo")
                            .queryParam("iiprop", "url|extmetadata")
                            .queryParam("format", "json")
                            .build())
                    .retrieve()
                    .body(WikiResponse.class);

            if (response != null && response.query() != null && response.query().pages() != null) {
                candidates = response.query().pages().values().stream()
                        .map(this::convertToRoundData)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.error("Wikimedia error", e);
        }

        if (candidates.size() < count) {
            log.warn("API just returned {} valid", candidates.size());
            candidates.addAll(getFallbackRounds());
        }

        Collections.shuffle(candidates);
        return candidates.subList(0, Math.min(candidates.size(), count));
    }

    private RoundData convertToRoundData(WikiResponse.Page page) {
        try {
            if (page.imageinfo() == null || page.imageinfo().isEmpty()) return null;

            var info = page.imageinfo().get(0);
            var meta = info.extmetadata();

            if (meta == null || meta.DateTimeOriginal() == null ||
            meta.GPSLatitude() == null || meta.GPSLongitude() == null) {
                return null;
            }

            String dateStr = meta.DateTimeOriginal().value();
            int year = parseYear(dateStr);
            if (year < 1800 || year > 2025) return null;

            double lat = Double.parseDouble(meta.GPSLatitude().value());
            double lon = Double.parseDouble(meta.GPSLongitude().value());

            return new RoundData(info.url(), lat, lon, year);
        } catch (Exception e) {
            return null;
        }
    }

    private int parseYear(String dateStr) {
        if (dateStr != null && dateStr.length() >= 4) {
            try {
                return Integer.parseInt(dateStr.substring(0, 4));
            } catch (NumberFormatException e) {
                return -1;
            }
        }
        return -1;
    }

    private List<RoundData> getFallbackRounds() {
        return List.of(
                new RoundData("https://upload.wikimedia.org/wikipedia/commons/a/af/Eiffel_Tower_1900_01.jpg", 48.8584, 2.2945, 1900),
                new RoundData("https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg", 40.7484, -73.9857, 1931),
                new RoundData("https://upload.wikimedia.org/wikipedia/commons/3/3a/Berlin_Wall_1989_fall.jpg", 52.5163, 13.3777, 1989)
        );
    }
}
