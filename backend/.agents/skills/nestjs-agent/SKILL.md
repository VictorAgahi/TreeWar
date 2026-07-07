---
name: nestjs-agent
description: Comprehensive Backend AI Agent skills for the TreeWar project, focusing on NestJS, WebSockets, and real-time state.
---
# NestJS Backend Guidelines (TreeWar)

When modifying the NestJS backend, services, or WebSockets gateways for the TreeWar project, adhere to these rules:

1. **Architecture & Encapsulation:**
   - Follow NestJS module boundaries strictly. Keep features cleanly isolated (e.g., `GameModule` encapsulating `GameSessionService` and `GameGateway`).
   - Keep controllers and gateways thin. Always delegate core business logic, role assignments, and game loops to injected Services.

2. **WebSockets & Real-Time State:**
   - Store real-time authoritative game state in-memory (e.g., using `Map<string, GameState>`) to minimize latency and simplify the POC structure. Avoid premature database/Redis scaling overheads.
   - For high-frequency events (like player movement), broadcast minimal payloads `(id, lat, lng)` instantly via `client.to(roomId).emit()`.
   - Implement an auto-healing mechanism by broadcasting periodic full-state snapshots to resolve any client-server desyncs naturally.

3. **Geospatial Security & Validation (Turf.js):**
   - **Never trust the client.** All proximity interactions (e.g., planting trees, sabotaging, meetings) must be validated server-side using Turf.js (`turf.distance`) before mutating the game state.
   - Optimize bandwidth by streaming only **deltas** (e.g., `{ streetId, heatValue }`) when heatmaps change, never full GeoJSON arrays over WebSockets.

4. **Robustness & Crash-Proofing:**
   - Handle disconnections gracefully: Flag disconnected players as inactive (e.g., `isAlive = false`) rather than hard-deleting their objects. This prevents cascading null pointer crashes in the game loop.
   - Ensure the Node.js event loop is never blocked by massive synchronous calculations. Keep Turf.js operations scoped to individual player interactions.
