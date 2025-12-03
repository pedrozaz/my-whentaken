package io.github.pedrozaz.whentaken.backend.controller;

import io.github.pedrozaz.whentaken.backend.dto.CreateRoomRequest;
import io.github.pedrozaz.whentaken.backend.dto.GuessRequest;
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

import java.security.Principal;

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
    public void createRoom(@Payload CreateRoomRequest request, SimpMessageHeaderAccessor headerAccessor, Principal principal) {
        String userId = principal.getName();
        String sessionId = headerAccessor.getSessionId();

        log.info("Request to create room from user: {} (Session: {})", userId, sessionId);

        GameRoom newRoom = gameService.createRoom(sessionId);
        gameService.joinRoom(newRoom.getRoomCode(), sessionId, request.nickname());

        messagingTemplate.convertAndSendToUser(userId, "/queue/reply", newRoom);
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

    @MessageMapping("/start")
    public void startGame(@Payload String roomCode, SimpMessageHeaderAccessor headerAccessor, Principal principal) {
        String sessionId = headerAccessor.getSessionId();
        log.info("Request to start game in room {} from session: {}", roomCode, sessionId);

        try {
            GameRoom startedRoom = gameService.startGame(roomCode, sessionId);

            messagingTemplate.convertAndSend("/topic/game/" + roomCode, startedRoom);
        } catch (RuntimeException e) {
            messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/errors", e.getMessage());
        }
    }

    @MessageMapping("/guess")
    public void submitGuess(@Payload GuessRequest request, SimpMessageHeaderAccessor headerAccessor, Principal principal) {
        String sessionId = headerAccessor.getSessionId();
        String userId = principal.getName();

        log.info("Request to submit guess from user: {} (Session: {})", userId, sessionId);

        try {
            GameRoom updatedRoom = gameService.processGuess(sessionId, request);

            messagingTemplate.convertAndSend("/topic/game/" + request.roomCode(), updatedRoom);
        } catch (RuntimeException e) {
            messagingTemplate.convertAndSendToUser(userId, "/queue/errors", e.getMessage());
        }
    }
}
