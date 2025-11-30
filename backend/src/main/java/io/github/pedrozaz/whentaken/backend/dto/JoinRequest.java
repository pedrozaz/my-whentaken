package io.github.pedrozaz.whentaken.backend.dto;

public record JoinRequest(
        String roomCode,
        String nickname
) {
}
