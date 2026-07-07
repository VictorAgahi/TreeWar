---
name: agent-robustness
description: Ensure dynamic accessibility (A11y), visual regression testing, and state validation.
---
# Compliance, Quality & Robustness

When creating generative UI and executing agent-driven actions:

1. **State Validation:** Always parse and validate LLM-generated output schemas using tools like Zod *before* React hydration. This ensures malformed agent output does not crash the React component tree.
2. **Dynamic Accessibility:** Utilize `aria-live="polite"` regions to textually narrate significant map updates to screen readers. Enforce WCAG APCA contrast ratio checks on any dynamically generated UI colors.
3. **Graceful Degradation:** Wrap all agent UI insertions and map layers in React Error Boundaries to guarantee a safe, human-readable fallback when generative logic fails.
