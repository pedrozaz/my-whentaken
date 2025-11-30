package io.github.pedrozaz.whentaken.backend.model;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class Player {

    private String sessionId;
    private String nickname;
    private int totalScore;

    private Double lastGuessLat;
    private Double lastGuessLon;
    private Integer lastGuessYear;

    private int lastRoundScore;
}
