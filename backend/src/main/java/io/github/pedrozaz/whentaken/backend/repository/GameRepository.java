package io.github.pedrozaz.whentaken.backend.repository;

import io.github.pedrozaz.whentaken.backend.model.GameRoom;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class GameRepository {

    private final Map<String, GameRoom> rooms = new ConcurrentHashMap<>();

    public GameRoom save(GameRoom room) {
        rooms.put(room.getRoomCode(), room);
        return room;
    }

    public Optional<GameRoom> findByRoomCode(String roomCode) {
        return Optional.ofNullable(rooms.get(roomCode));
    }

    public void delete(String roomCode) {
        rooms.remove(roomCode);
    }

    public boolean exists(String roomCode) {
        return rooms.containsKey(roomCode);
    }
}
