package io.github.pedrozaz.whentaken.backend.model;

public record RoundData(
        String imageUrl,
        double lat,
        double lon,
        int year
) {
}
