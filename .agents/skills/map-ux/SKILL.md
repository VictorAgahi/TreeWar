---
name: map-ux
description: Enforce Spatial Context Management and Generative UI patterns for Mapbox/Leaflet integrations.
---
# Map-Based UX/UI Design Skills

When building or modifying map interfaces (e.g., Mapbox, Leaflet) in this project, ensure you adhere to these guidelines:

1. **Spatial Context Management:** Always use cinematic, smooth transitions (e.g., `flyTo`, `flyToBounds`) with appropriate padding instead of instant snapping/teleporting.
2. **Respect User Interaction:** Never interrupt a user's active map interactions (panning, zooming) with an automatic agent-driven animation.
3. **Intent-Driven UI:** Adapt map overlays, sidebars, and markers dynamically based on the current context (e.g., routing mode vs. overview mode), avoiding the rendering of cluttered, raw geographic data.
