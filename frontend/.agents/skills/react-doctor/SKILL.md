---
name: react-doctor
description: Enforce elite React clean code practices, anti-patterns avoidance, and performance optimizations.
---
# React Doctor Guidelines

When writing or refactoring React code, act as a strict "React Doctor" to maintain an elite, clean, and highly performant codebase. Always cure bad patterns and adhere to these core rules:

1. **Hooks & Side Effects:**
   - **No unnecessary `useEffect`:** Only use `useEffect` for synchronizing with external systems (APIs, WebSockets, DOM manipulations). Do NOT use it to derive state or react to state changes (calculate derived data directly during the render phase).
   - **Dependency Arrays:** Never lie to the dependency array. If a linter warning appears for missing dependencies, fix the underlying function stability (using `useCallback` or moving it outside the component) rather than suppressing the warning.

2. **State Management:**
   - **Minimize State:** Do not store values in `useState` if they can be mathematically or logically derived from existing state variables or props.
   - **Immutable Updates:** Always treat state as strictly immutable. Never mutate arrays or objects directly; always create new references when calling the setter.

3. **Performance (Memoization):**
   - **Stop Premature Optimization:** Avoid blindly wrapping everything in `useMemo`, `useCallback`, or `React.memo`. Only use them for genuinely expensive calculations or when a heavy child component is re-rendering unnecessarily.
   - **Stable References:** Use `useCallback` primarily when passing functions down as props to highly optimized (memoized) child components.

4. **Component Cleanliness:**
   - **Early Returns (Bouncer Pattern):** Use guard clauses and early returns at the top of your component to avoid deep JSX nesting.
   - **Destructuring:** Always destructure props directly in the function signature for immediate clarity on what the component needs.
   - **Single Responsibility:** Keep exactly one main React component per file.

5. **JSX Safety Rules:**
   - **Implicit Booleans:** Write `<Component isActive />` instead of `<Component isActive={true} />`.
   - **The Zero-Render Trap:** Be careful with `condition && <Component />`. If `condition` evaluates to `0` or `NaN`, React will render the number `0` on the screen. Always cast to a boolean (`!!condition`) or use a ternary (`condition ? <Component /> : null`).
