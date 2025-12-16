---
name: telegram-bot-layered-architecture
description: 4-layer architecture for Telegram bots. Use when building features, refactoring, or making architectural decisions.
---

# Telegram Bot 4-Layer Architecture

## Core Principle

Strict unidirectional dependencies: Layer 3 → Layer 2 → Layer 1 → Layer 0

Each layer has one purpose and only calls the layer directly below it.

## The Layers

### Layer 0: I/O (`src/db/`, `src/services/`)

**Purpose:** External system communication only

**Database (`src/db/`):**

- Schema definitions
- Database client export
- No queries (those are Layer 1)

**Services (`src/services/`):**

- External API clients (one class per service)
- HTTP calls, authentication, response transformation
- No business logic

**Key insight:** Database and external APIs are both I/O operations, they belong in the same layer.

### Layer 1: Operations (`src/lib/`)

**Purpose:** ALL interactions with Layer 0

**Responsibilities:**

- Every database query
- Every service call
- Data transformations and calculations
- Reusable atomic operations

**Critical rule:** This is the ONLY layer that calls Layer 0. Layer 2 never touches database or services directly.

**Naming:** Action-based, descriptive names (e.g., `getUserItems`, `fetchMarketData`, `insertItem`)

### Layer 2: Commands (`src/api/`)

**Purpose:** Complete user-facing operations (business logic core)

**Responsibilities:**

- Validate all inputs with Zod schemas
- Orchestrate Layer 1 operations to complete commands
- Implement command-level business rules
- Return structured results

**Critical rule:** ONLY calls Layer 1. Never calls Layer 0.

**Key insight:** One API function = one user command. If a user can do it, there's an API function for it.

**Export pattern:** Always export all commands from `src/api/index.ts`

### Layer 3: Interfaces (`src/interfaces/`)

**Purpose:** Present Layer 2 commands to users

**The three required interfaces:**

- **CLI (`cli.ts`):** Local testing, instant feedback
- **Polling (`telegram-polling.ts`):** Development with real Telegram
- **Webhooks (`telegram.ts`):** Production deployment

**Responsibilities:**

- Parse user input
- Call appropriate Layer 2 command
- Format and display result

**Critical rule:** ONLY calls Layer 2. No business logic, no validation, no Layer 1, no Layer 0.

**Important:** Bot command handlers are identical between polling and webhook interfaces. Only the server setup differs. Consider abstracting shared handlers into `src/interfaces/telegram-handlers.ts` imported by both.

## File Structure

```
src/
├── db/                    # Layer 0: Database I/O
├── services/              # Layer 0: External API I/O
├── lib/                   # Layer 1: All operations
├── api/                   # Layer 2: Commands (business logic)
└── interfaces/            # Layer 3: UI (CLI, polling, webhooks)
```

## Dependency Rules

- **Layer 3 → Layer 2 only**
- **Layer 2 → Layer 1 only**
- **Layer 1 → Layer 0 only**
- **Layer 0 → nothing**

Never skip layers. Never reverse direction.

## Adding a Feature

1. **Schemas:** Define Zod validation schema
2. **Layer 1:** Create operations for database/service interactions
3. **Layer 2:** Create command that validates and orchestrates Layer 1
4. **Layer 3:** Add to CLI, then both Telegram interfaces

## Validation

All Layer 2 commands must validate inputs with Zod.

## Testing Flow

1. Test with CLI (fastest)
2. Test with polling (real Telegram, local)
3. Deploy webhooks (production)

## Interface Synchronization

When updating a command, update all three interfaces (CLI, polling, webhooks) to keep them in sync.

## Review Questions

When reviewing code, check:

1. Does Layer 2 or 3 call database/services directly? → Move to Layer 1
2. Does Layer 3 have business logic or validation? → Move to Layer 2
3. Does Layer 2 validate inputs? → Add Zod schema
4. Are all three interfaces updated? → Sync them
5. Are polling/webhook handlers duplicated? → Abstract to shared file
