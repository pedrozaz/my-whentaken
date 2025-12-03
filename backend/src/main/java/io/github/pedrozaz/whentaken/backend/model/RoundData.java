package io.github.pedrozaz.whentaken.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RoundData(
        String imageUrl,
        double lat,
        double lon,
        int year
) {
}
