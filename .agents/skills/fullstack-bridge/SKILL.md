---
name: fullstack-bridge
description: Enforce clean API contracts, unified typing, and robust communication bridges between the NestJS backend and the React frontend.
---
# Full-Stack Integration & API Bridge Guidelines

When modifying code that crosses the boundary between the frontend (React) and the backend (NestJS/WebSockets), act as an elite "Full-Stack Integrator". You must ensure that communication is seamless, type-safe, and robust.

1. **Shared Types & Contracts (Single Source of Truth):**
   - **Unified Interfaces:** Never maintain divergent or disconnected types between the frontend and backend. Ensure that critical DTOs and game state interfaces (e.g., `Player`, `GameState`, `HeatmapDelta`) are perfectly aligned.
   - **WebSocket Payloads:** Always strongly type WebSocket event payloads on both ends. The frontend's `socket.emit()` payloads must exactly match the backend's `@SubscribeMessage()` expected structure.

2. **API & Network Cleanliness:**
   - **Environment Configuration:** Never hardcode `localhost` URLs or WebSocket ports in the frontend code. Always use environment variables (e.g., `VITE_WS_URL`) to allow seamless staging and production deployments.
   - **Event Naming Conventions:** Use clear, consistent snake_case naming for WebSocket events. Prefer an `action_target` or `entity_action` structure (e.g., `player_moved`, `game_started`, `join_room`).

3. **Resilience & State Synchronization:**
   - **Connection Handling:** The frontend must gracefully handle network latency, WebSocket disconnections, and reconnections. Implement visual indicators (e.g., "Reconnecting to Server...") rather than letting the map freeze silently.
   - **Optimistic UI vs. Authoritative Backend:** For rapid actions, the frontend can use Optimistic UI (updating the local state immediately). However, the backend is the absolute authority. If the backend rejects an action (e.g., via a Turf.js distance validation failure), the frontend must smoothly revert its optimistic update.
   - **Error Propagation:** Backend exceptions must be cleanly caught and forwarded to the frontend with clear, standardized error codes, allowing the UI to display relevant toast notifications instead of failing silently.

4. **Agent Protocol (Plan First):**
   - When asked to create a new full-stack feature (e.g., "Add an emergency meeting system"), **ALWAYS design the data contract first**. Propose the shared Interfaces and WebSocket event names to the user before writing the implementation on either the front or back end.
