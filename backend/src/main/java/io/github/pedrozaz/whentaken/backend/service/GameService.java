package io.github.pedrozaz.whentaken.backend.service;

import io.github.pedrozaz.whentaken.backend.model.GameRoom;
import io.github.pedrozaz.whentaken.backend.model.Player;
import io.github.pedrozaz.whentaken.backend.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class GameService {

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
}
