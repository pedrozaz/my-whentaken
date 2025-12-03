package io.github.pedrozaz.whentaken.backend.service;

import io.github.pedrozaz.whentaken.backend.dto.GuessRequest;
import io.github.pedrozaz.whentaken.backend.model.GameRoom;
import io.github.pedrozaz.whentaken.backend.model.GameState;
import io.github.pedrozaz.whentaken.backend.model.Player;
import io.github.pedrozaz.whentaken.backend.model.RoundData;
import io.github.pedrozaz.whentaken.backend.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {

    private static final List<RoundData> MOCK_ROUNDS = List.of(
            new RoundData("https://upload.wikimedia.org/wikipedia/commons/a/af/Eiffel_Tower_1900_01.jpg", 48.8584, 2.2945, 1900),
            new RoundData("https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg", 40.7484, -73.9857, 1931),
            new RoundData("https://upload.wikimedia.org/wikipedia/commons/3/3a/Berlin_Wall_1989_fall.jpg", 52.5163, 13.3777, 1989)
    );


    private final GameRepository gameRepository;
    private static final int CODE_LENGTH = 4;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private final SecureRandom random = new SecureRandom();

    /**
     * Creates a new room and returns the object
     */
    public GameRoom createRoom(String hostSessionId) {
        String code = generateUniqueRoomCode();

        GameRoom room = new GameRoom();
        room.setRoomCode(code);
        room.setHostSessionId(hostSessionId);

        return gameRepository.save(room);
    }

    /**
     * Try to add a player to an existing room
     */
    public GameRoom joinRoom(String roomCode, String sessionId, String nickname) {
        GameRoom room = gameRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomCode));

        Player newPlayer = Player.builder()
                .sessionId(sessionId)
                .nickname(nickname)
                .totalScore(0)
                .build();
        room.addPlayer(newPlayer);

        return room;
    }

    // Room unique code generation
    private String generateUniqueRoomCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i< CODE_LENGTH; i++) {
                sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
            }
            code = sb.toString();
        } while (gameRepository.exists(code));
        return code;
    }

    public GameRoom startGame(String roomCode, String requesterSessionId) {
        GameRoom room = gameRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomCode));

        if (!room.getHostSessionId().equals(requesterSessionId)) {
            throw new RuntimeException("Only the host can start the game!");
        }

        room.setCurrentState(GameState.PLAYING);
        room.setCurrentRoundNumber(1);
        room.setCurrentRoundData(MOCK_ROUNDS.get(random.nextInt(MOCK_ROUNDS.size())));

        room.setRoundEndTime(System.currentTimeMillis() + 60000);

        return room;
    }

    public GameRoom processGuess(String sessionId, GuessRequest request) {
        GameRoom room = gameRepository.findByRoomCode(request.roomCode())
                .orElseThrow(() -> new RuntimeException("Room not found: " + request.roomCode()));

        Player player = room.getPlayers().get(sessionId);
        if (player == null) throw new RuntimeException("Player not found");

        if (player.getLastGuessLat() != null) {
            throw new RuntimeException("You've already guessed this round!");
        }

        RoundData target = room.getCurrentRoundData();
        int distanceScore =  calculateDistanceScore(request.lat(), request.lon(), target.lat(), target.lon());
        int yearScore = calculateYearScore(request.year(), target.year());
        int totalRoundScore = (distanceScore + yearScore) / 2;

        player.setLastGuessLat(request.lat());
        player.setLastGuessLon(request.lon());
        player.setLastGuessYear(request.year());
        player.setLastRoundScore(totalRoundScore);
        player.setTotalScore(player.getTotalScore() + totalRoundScore);

        boolean allGuessed = room.getPlayers().values().stream()
                .allMatch(p -> p.getLastGuessLat() != null);

        return room;
    }

    private int calculateDistanceScore(double lat1, double lon1, double lat2, double lon2) {
        double distanceKm = haversine(lat1, lon1, lat2, lon2);
        return (int) (2500 * Math.exp(-distanceKm / 2000.0));
    }

    private int calculateYearScore(int guessYear, int actualYear) {
        int diff = Math.abs(guessYear - actualYear);
        if (diff == 0) return 2500;
        return (int) (2500 * Math.exp(-diff / 10.0));
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
