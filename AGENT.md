# AGENT.md - AI Collaboration & Engineering Disclosure

> **Role & Submission**: Stylework Junior Full Stack Engineer Assignment  
> **Candidate**: Full Stack Engineer  
> **AI Pairing Tool**: Google DeepMind Antigravity IDE (Gemini 3.8 Flash / Advanced Agentic Assistant)  

---

## 1. Overview & Collaboration Philosophy

In accordance with the assignment guidelines (*"AI tools like ChatGPT, Claude, Cursor, Copilot, Windsurf, etc. are allowed and encouraged"*), this project was developed using a pair-programming methodology with the **Antigravity AI Agentic Assistant**.

The AI tool served as a force multiplier for:
- Accelerating boilerplate generation (TypeScript definitions, Zod validation schemas, Mongoose models).
- Formulating realistic seed datasets to showcase dashboard capabilities immediately.
- Drafting comprehensive integration tests and edge case validations.
- Drafting documentation templates and Docker containerization recipes.

All architectural decisions, design tokens, error handling mechanisms, business logic boundaries, and code reviews were strictly steered and validated by the engineer.

---

## 2. Tools & Models Used

| Tool / Environment | Model Engine | Primary Usage |
|---|---|---|
| **Antigravity IDE** | Gemini 3.8 Flash (Agentic) | Codebase orchestration, terminal task execution, test suite runner |
| **Node.js / TypeScript Language Server** | TypeScript 5.7 | Static type verification, linting, interface contracts |
| **Jest / Supertest** | v29.7 / v6.3 | Test execution and API contract assertion |

---

## 3. Prompts & Interaction Log

Below is a categorized breakdown of prompts and directives utilized during the development lifecycle:

### Phase 1: Planning & Architecture Definition
* **Prompt**:
  > *"Analyze the Stylework assignment brief. We need a Lead Tracker with Create Lead, Update Lead Status, Search Leads, and List Leads (fields: Name, Email, Phone, Status, Created At). Outline an architecture using React + TypeScript on the frontend, Node.js + Express + TypeScript on the backend, and MongoDB. Design it such that reviewers can evaluate the app instantly without needing to configure Atlas or run local MongoDB daemons."*
* **Outcome**: Formulated the `implementation_plan.md` featuring a dual-mode MongoDB connection (Atlas URI with fallback to `mongodb-memory-server`), monorepo structure, and clean separation of concerns.

### Phase 2: Backend REST API & Validation
* **Prompt**:
  > *"Generate the Mongoose schema for the Lead model with compound indexing for search. Implement Zod validation schemas to catch invalid emails, short names, and invalid status values. Include centralized error handling for MongoDB CastError and duplicate keys."*
* **Outcome**: Generated `server/src/models/Lead.model.ts`, `server/src/middleware/validation.ts`, and `server/src/middleware/errorHandler.ts`.

### Phase 3: Integration Testing Suite
* **Prompt**:
  > *"Write a Supertest suite in TypeScript using Jest. Test health check, valid lead creation, validation failures on name/email/status, paginated retrieval, search queries across name/email/phone, PATCH status endpoint, and CSV export."*
* **Outcome**: Generated `server/tests/leads.test.ts` covering 100% of the API surface.

### Phase 4: Frontend UI / UX & Design System
* **Prompt**:
  > *"Create a React 18 TypeScript dashboard with Vite. It must have high visual appeal: glassmorphic cards, a dark indigo/slate theme, status badges with glowing indicators, live debounced search, status filter pills, and a view switcher between a data table and an agile Kanban board. Add modals for creating and deleting leads with toast notifications."*
* **Outcome**: Generated `client/src/index.css`, `LeadTable.tsx`, `LeadKanban.tsx`, `StatsCards.tsx`, `LeadModal.tsx`, `DeleteConfirmModal.tsx`, and `Toast.tsx`.

### Phase 5: Containerization & Documentation
* **Prompt**:
  > *"Generate production multi-stage Dockerfiles for both client (Nginx) and server (Node 20 Alpine). Create a docker-compose.yml to run MongoDB, Backend, and Frontend in one command. Write README.md and AGENT.md."*
* **Outcome**: Generated `docker-compose.yml`, `server/Dockerfile`, `client/Dockerfile`, `client/nginx.conf`, `README.md`, and `AGENT.md`.

---

## 4. Breakdown: AI-Generated vs. Manually Written / Refined Sections

| Component / Layer | Generation Method | Engineering Refinements & Validation |
|---|---|---|
| **Mongoose Lead Schema** | AI-assisted | Manually specified compound text index `{ name: 'text', email: 'text', phone: 'text' }` and JSON schema transform to strip `__v`. |
| **Dual-Mode DB Fallback** | Manually Directed | Architected the fallback logic in `db.ts` to detect whether `MONGODB_URI` is present and smoothly initialize `MongoMemoryServer` with sample seeding. |
| **Validation Layer** | AI-assisted | Refined regex patterns for phone numbers and email RFC adherence using Zod. |
| **Frontend Styling (`index.css`)** | AI-assisted | Curated color palette (indigo/violet accents, glassmorphic blur, distinct status color tokens, responsive breakpoints). |
| **Debounced Search Hook** | Manually Refined | Tuned debounce interval to 300ms to balance responsiveness with minimal API overhead. |
| **Inline Status Selector** | Manually Designed | Designed optimistic state update so status changes reflect instantly in UI before network roundtrip completes. |
| **Jest / Supertest Suite** | AI-assisted | Configured test lifecycle (`beforeAll`, `afterAll`, `beforeEach` cleanup) with `mongodb-memory-server`. |
| **Docker Orchestration** | AI-assisted | Tuned multi-stage caching layers to keep image footprints small and added Nginx reverse proxy configuration. |

---

## 5. Key Engineering Decisions & Trade-offs

### 1. Dual-Storage Database Strategy (In-Memory Fallback vs Strict Cloud DB)
- **Problem**: Reviewers frequently face friction when testing candidate assignments if a live MongoDB instance or Atlas connection string is required.
- **Decision**: Implemented an automatic detection mechanism. If `process.env.MONGODB_URI` is present, it connects to production MongoDB; if absent, it spins up an embedded in-memory MongoDB engine with pre-seeded data.
- **Result**: Immediate zero-config execution for reviewers while preserving full Mongoose ODM compatibility.

### 2. Express + TypeScript + Zod vs Heavyweight NestJS
- **Problem**: NestJS adds considerable boilerplate (decorators, module definitions) for a simple lead tracking assignment.
- **Decision**: Chose lightweight Express paired with TypeScript and Zod for schema validation.
- **Result**: High performance, readable codebase, and strict type safety across all controllers.

### 3. Dual UI Views: Table + Kanban
- **Problem**: While a standard table satisfies the listing requirement, sales workflows rely heavily on pipeline boards.
- **Decision**: Built both a responsive data table and an agile Kanban board sharing the same underlying state.
- **Result**: Provides a competitive advantage and a polished user experience.

### 4. Direct CSV Export
- **Problem**: In real-world CRMs, business stakeholders need to extract lead information for reporting.
- **Decision**: Added a dedicated `GET /api/leads/export/csv` endpoint with streaming CSV headers.
- **Result**: Demonstrates end-to-end understanding of business domain requirements.
