package io.github.pedrozaz.whentaken.backend.model;

import lombok.Data;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Data
public class GameRoom {

    private String roomCode;
    private String hostSessionId;
    private GameState currentState = GameState.WAITING;
    private long roundEndTime;

    private int currentRoundNumber = 0;
    private int totalRounds = 5;
    private RoundData currentRoundData;

    private List<RoundData> roundsQueue;

    private final Map<String, Player> players = new ConcurrentHashMap<>();

    public void addPlayer(Player player) {
        players.put(player.getSessionId(), player);
    }

    public void removePlayer(String sessionId) {
        players.remove(sessionId);
    }
}
