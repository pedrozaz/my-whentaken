package io.github.pedrozaz.whentaken.backend.controller;

import io.github.pedrozaz.whentaken.backend.dto.CreateRoomRequest;
import io.github.pedrozaz.whentaken.backend.dto.JoinRequest;
import io.github.pedrozaz.whentaken.backend.model.GameRoom;
import io.github.pedrozaz.whentaken.backend.service.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class GameWebSocketController {

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * @endpoint /app/create
     * @action creates room and returns object's room only for creator
     */
    @MessageMapping("/create")
    public void createRoom(@Payload CreateRoomRequest request, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        log.info("Request to create room from session: {}", sessionId);

        GameRoom newRoom = gameService.createRoom(sessionId);
        gameService.joinRoom(newRoom.getRoomCode(), sessionId, request.nickname());

        messagingTemplate.convertAndSendToUser(sessionId, "/queue/reply", newRoom);
    }

    /**
     * @endpoint /app/join
     * @action adds a player and tells ALL from room
     */
    @MessageMapping("/join")
    public void joinRoom(@Payload JoinRequest request, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        log.info("Request to join room {} from session: {}", request.roomCode() ,sessionId);

        try {
            GameRoom updatedRoom = gameService.joinRoom(request.roomCode(), sessionId, request.nickname());
            messagingTemplate.convertAndSend("/topic/game/" + request.roomCode(), updatedRoom);
        } catch (RuntimeException e) {
            messagingTemplate.convertAndSendToUser(sessionId, "/queue/errors", e.getMessage());
         }
    }
}
