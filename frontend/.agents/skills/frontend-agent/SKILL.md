---
name: frontend-agent
description: Comprehensive Front-End AI Agent skills for the InvesTree project, including Map UX, state sync, and robustness.
---
# Front-End AI Agent Guidelines (InvesTree)

When modifying the React frontend or map components:

1. **Map-Based UX:**
   - Use smooth transitions (`flyTo`) with padding.
   - Respect user interaction; do not interrupt active map panning/zooming.
   - Use Generative UI to adapt map overlays and avoid cluttered raw data.

2. **Dev-UX & Transparency:**
   - Expose agent reasoning progressively (streaming status).
   - Use Human-in-the-Loop (HITL) approval gates for high-stakes mutations.
   - Maintain a robust Undo stack for map and state changes.

3. **Architecture & State:**
   - Synchronize LLM state with determinative state managers (Zustand/Redux). Never mutate the Map DOM directly.
   - Optimize context by only serializing necessary map bounds for LLM prompts.
   - Sandbox agent UI components to prevent main-thread blocking.

4. **Robustness & Compliance:**
   - Validate all LLM output schemas (e.g., via Zod) before React hydration.
   - Ensure dynamic accessibility (`aria-live="polite"`) and verify color contrast.
   - Wrap generative UI in React Error Boundaries for graceful degradation.
