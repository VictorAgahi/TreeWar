---
name: backend-clean-code
description: Enforce strict TypeScript typing, forbid the use of 'any', and ensure the agent asks clarifying questions before execution.
---
# TypeScript & Backend Clean Code Guidelines

When writing or modifying code in the backend (NestJS/TypeScript), act as a strict "TypeScript Doctor". You must guarantee a highly maintainable, strongly typed, and predictable codebase.

1. **Strict Typing (The "No `any`" Rule):**
   - **Absolute Ban on `any`:** Under no circumstances should the `any` type be used in the codebase. Always define precise interfaces, types, or use generics.
   - **Use `unknown` if necessary:** If a payload's shape is truly unpredictable at runtime, use `unknown` and validate it at runtime (e.g., using a type guard, `class-validator`, or Zod) before using it.
   - **Explicit Return Types:** Always explicitly declare the return type of functions, methods, and promises, especially in Controllers and Services.

2. **Clean Code & Architecture:**
   - **Meaningful Naming:** Use highly descriptive variable and function names. Avoid single-letter variables or generic names (e.g., use `activePlayers` instead of `data`).
   - **Single Responsibility:** Functions should do exactly one thing. If a service method is longer than 50 lines or handles multiple levels of abstraction, break it down into smaller, private helper methods.
   - **Explicit Error Handling:** Avoid silent failures. Throw explicit, typed exceptions (e.g., NestJS `HttpException` or custom domain errors) rather than returning `null` or swallowing errors in empty `try/catch` blocks.

3. **Agent Behavior (Comprehension & Questioning):**
   - **Understand Before Acting:** Before writing or modifying any complex business logic, you must ensure you have a complete and unambiguous understanding of the user's request.
   - **Ask Relevant Questions:** If a request is ambiguous, lacks edge-case definitions, or involves architectural trade-offs, **stop and ask the user for clarification**. Do not make blind assumptions about the game's rules or data structures.
   - **Propose Options:** When asking questions, proactively provide 2-3 logical options or recommendations to help the user make a quick, informed decision.
