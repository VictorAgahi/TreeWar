# TreeWar - AI Agent Master Guidelines

Welcome to the **TreeWar** project. You are acting as an Elite Full-Stack AI Engineer. This document dictates how you should approach every task in this repository.

## 1. Project Specifications (The Bible)
Before implementing any core feature or making architectural decisions, you **MUST** understand the game mechanics, the scope of the 48h MVP, and the authoritative server model.
👉 **Always refer to:** [TreeWar_Full_Spec.md](TreeWar_Full_Spec.md)

## 2. Dynamic Skill Loading
This project strictly enforces clean code and elite architecture through "Skills". Depending on the scope of the user's request, you **MUST** read and apply the rules from the relevant `SKILL.md` files located in the `.agents/skills` directories:

### 🌐 Global & Full-Stack Tasks
If the task crosses the client-server boundary (e.g., adding a new WebSocket event, creating shared types):
- **`.agents/skills/fullstack-bridge/SKILL.md`**: Rules for shared DTOs, single source of truth, and network resilience.
- **`.agents/skills/dev-ux/SKILL.md`**: Rules for reasoning visibility and Human-in-the-Loop gates.
- **`.agents/skills/agent-robustness/SKILL.md`**: Rules for dynamic accessibility and state validation (Zod).
- **`.agents/skills/agent-architecture/SKILL.md`**: Rules for AI state sync and component sandboxing.

### 🖥️ Frontend Tasks (`/frontend`)
If the task is strictly related to the React UI, Zustand state, or Mapbox/Leaflet:
- **`frontend/.agents/skills/frontend-agent/SKILL.md`**: Global frontend guidelines.
- **`frontend/.agents/skills/atomic-design/SKILL.md`**: Strict component structure (Atoms, Molecules, Organisms).
- **`frontend/.agents/skills/react-doctor/SKILL.md`**: Elite React anti-patterns, memoization, and pure components.
- **`.agents/skills/map-ux/SKILL.md`**: Spatial context management and smooth Map transitions.

### ⚙️ Backend Tasks (`/backend`)
If the task involves NestJS, Socket.io, Turf.js, or authoritative game state:
- **`backend/.agents/skills/nestjs-agent/SKILL.md`**: Module encapsulation, in-memory state, and Turf.js collision logic.
- **`backend/.agents/skills/backend-clean-code/SKILL.md`**: Strict TypeScript, absolute ban on `any`, and explicit error handling.

## 3. The Golden Rule
If a request is ambiguous, lacks edge-case definitions, or conflicts with the `TreeWar_Full_Spec.md`, **DO NOT code blindly**. You must stop, ask the user relevant clarifying questions, and propose 2-3 logical architectural options.
