---
name: atomic-design
description: Enforce Atomic Design principles (Atoms, Molecules, Organisms) to optimize front-end UI component structure and reusability.
---
# Atomic Design Guidelines

When creating or refactoring UI components in the React frontend, strictly adhere to the Atomic Design methodology to ensure maximum reusability, maintainability, and visual consistency:

1. **Atoms (`src/components/atoms/`):**
   - **Definition:** The fundamental building blocks of the UI that cannot be broken down further.
   - **Examples:** Buttons, Inputs, Labels, Icons, Badges.
   - **Rule:** Atoms should be completely dumb and stateless. They rely entirely on props (e.g., `onClick`, `variant`, `size`) and must contain **zero** business logic or global state dependencies.

2. **Molecules (`src/components/molecules/`):**
   - **Definition:** Simple UI components built by combining two or more Atoms to function together as a unit.
   - **Examples:** Search Bar (Input + Button), Form Field (Label + Input + Error Message), Player Avatar Card.
   - **Rule:** Molecules focus on doing one specific thing well. They can handle simple local UI state (e.g., toggle active state) but should still avoid complex business logic or direct API calls.

3. **Organisms (`src/components/organisms/`):**
   - **Definition:** Complex UI sections composed of groups of Molecules, Atoms, and/or other Organisms.
   - **Examples:** Navigation Header, Map Sidebar, Player Voting Panel, Sabotage Dashboard.
   - **Rule:** Organisms form distinct, standalone sections of an interface. They **can** be connected to the global state manager (e.g., Zustand) and contain business logic/event handlers, orchestrating the data flow to their child Molecules and Atoms.

4. **Templates & Pages (`src/components/templates/` & `src/pages/`):**
   - **Templates:** The wireframes. They dictate the layout grid and component placement without being tied to real data.
   - **Pages:** Specific instances of templates, populated with real application data and connected to the router.

### Best Practices for Agents & Developers
- **Reusability Check:** Before creating a new component, always verify if an existing Atom or Molecule can be reused or simply extended via a new prop.
- **Strict Typing:** Always export clear TypeScript interfaces for component props at every level to maintain clean, predictable contracts.
- **Isolation:** Never inject Zustand stores, context, or API hooks directly into Atoms or Molecules. Keep data fetching strictly at the Organism or Page level.
