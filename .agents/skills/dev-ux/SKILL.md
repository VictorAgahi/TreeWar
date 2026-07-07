---
name: dev-ux
description: Ensure agent reasoning visibility, Human-in-the-Loop gates, and interface transparency.
---
# Dev-UX & Interface Transparency

When designing AI agent interactions and state mutations:

1. **Reasoning Visibility:** Expose internal agent thought processes progressively to the user (e.g., via streaming status text). Avoid generic, opaque loading spinners for operations taking longer than 400ms.
2. **HITL (Human-in-the-Loop) Gates:** Enforce declarative approval interface gates before executing high-stakes mutations (e.g., heavy API calls, massive DB writes). Always provide a "Reject & Modify" path.
3. **Undo Mechanics:** Ensure that modifications to both the application state and the map's visual layers can be reliably reverted simultaneously using a persistent Undo stack.
