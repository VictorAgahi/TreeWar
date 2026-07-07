---
name: agent-architecture
description: Implement robust AI state synchronization and context caching for map applications.
---
# Clean Code & Front-End Architecture

When bridging non-deterministic LLM interactions with rigid client-side state:

1. **State Synchronization:** Always use determinative state managers (like Zustand or Redux) as intermediaries. Agents must dispatch actions to the store and *never* mutate the Map DOM directly.
2. **Context Optimization:** Only serialize relevant map context (like center coordinates and zoom bounding box) for LLM prompts. Prevent token bloat by never sending massive raw GeoJSON datasets back to the model.
3. **Component Sandboxing:** Ensure dynamically generated agent UI components operate within safe boundaries to prevent main-thread blocking.
