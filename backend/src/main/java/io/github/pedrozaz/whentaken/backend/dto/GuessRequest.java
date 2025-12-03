package io.github.pedrozaz.whentaken.backend.dto;

public record GuessRequest(
        String roomCode,
        double lat,
        double lon,
        int year
) {
}
