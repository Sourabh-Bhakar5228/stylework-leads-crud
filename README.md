# Stylework Lead Tracker - Enterprise Workspace CRM

> **Assignment Submission**: Junior Full Stack Engineer Assignment  
> **Technology Stack**: React 18 + TypeScript + Vite | Node.js + Express + TypeScript | MongoDB + Mongoose  
> **Live Vercel Frontend**: [https://stylework-leads-crud.vercel.app](https://stylework-leads-crud.vercel.app)  
> **Live Render Backend & App**: [https://stylework-leads-crud.onrender.com](https://stylework-leads-crud.onrender.com)  
> **Live API Endpoint**: [https://stylework-leads-crud.onrender.com/api/leads](https://stylework-leads-crud.onrender.com/api/leads)  
> **Live Health Check**: [https://stylework-leads-crud.onrender.com/api/health](https://stylework-leads-crud.onrender.com/api/health)  
> **Architecture**: Decoupled Client-Server Monorepo with Docker Orchestration and Dual-Mode MongoDB Storage  

---

## 🌟 Executive Summary & Features

**LeadPulse** is a high-performance, modern Lead Tracking and CRM dashboard tailored for coworking, managed office spaces, and enterprise workspace leasing teams. It streamlines inbound inquiry capture, status pipeline progressions, and qualification workflows.

### Core Assignment Requirements Fulfilled
- ✅ **Create Lead**: Intuitive slide-in / modal form with real-time field validation (Name, Email, Phone, Initial Status, Notes).
- ✅ **Update Lead Status**: Inline one-click dropdown selector as well as Kanban drag/move capability across all pipeline stages.
- ✅ **Search Leads**: Instant debounced search querying across Name, Email, and Phone simultaneously.
- ✅ **List Leads**: Rich tabular view with relative timestamps, avatar generation, and status badges.
- ✅ **Required Fields**: `Name`, `Email`, `Phone`, `Status`, `CreatedAt` + optional `Notes` & `UpdatedAt`.

### Production & UX Enhancements Added
- 📊 **Real-time Pipeline KPI Metrics**: Total Leads, New Inquiries, Active Deals in Progress, and Won Conversion Rate %.
- 📋 **Dual View Modes**: Seamless toggle between a data-dense **Table View** and an agile **Kanban Pipeline Board**.
- 📥 **One-Click CSV Export**: Direct CSV report generation endpoint (`GET /api/leads/export/csv`) for sales reports and external audit.
- ⚡ **Zero-Friction In-Memory MongoDB Fallback**: Allows reviewers and evaluators to clone and run the application with a single command without having a local MongoDB service or remote Atlas connection preconfigured.
- 🐳 **Docker & Docker Compose**: Multi-stage production containerization for instant local reproducibility.
- 🧪 **Automated Testing Suite**: Full API integration testing with Jest & Supertest.

---

## 🏛 System Architecture

The application is structured as an enterprise-grade monorepo cleanly decoupling the presentation layer, the API business layer, and the persistence engine.

```
                    ┌────────────────────────────────────────┐
                    │          React + TypeScript UI         │
                    │   (Vite + Lucide Icons + Glassmorphism)│
                    └───────────────────┬────────────────────┘
                                        │ HTTP / REST (/api/*)
                                        ▼
                    ┌────────────────────────────────────────┐
                    │      Node.js + Express API Server      │
                    │ (Zod Validation, Helmet, CORS, Morgan) │
                    └───────────────────┬────────────────────┘
                                        │ Mongoose ODM
                                        ▼
                    ┌────────────────────────────────────────┐
                    │         MongoDB Database Layer         │
                    │  [Production: Atlas / Docker Mongo]    │
                    │  [Fallback: In-Memory Mongo Engine]    │
                    └────────────────────────────────────────┘
```

### Directory Structure
```
stylework-lead-tracker/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── api/                # Typed Fetch API client
│   │   ├── components/         # Header, StatsCards, Filters, Table, Kanban, Modals, Toast
│   │   ├── types/              # Domain TypeScript interfaces
│   │   ├── App.tsx             # Root layout & state controller
│   │   ├── main.tsx            # React DOM bootstrap
│   │   └── index.css           # Modern design system & token definitions
│   ├── Dockerfile              # Multi-stage production Nginx container
│   ├── nginx.conf              # Nginx reverse proxy configuration
│   ├── vite.config.ts          # Vite build configuration with API proxy
│   └── package.json
├── server/                     # Backend API Service
│   ├── src/
│   │   ├── config/             # DB connection with auto-fallback & seeder
│   │   ├── controllers/        # CRUD, metrics aggregation, CSV export
│   │   ├── middleware/         # Zod validator & global error handlers
│   │   ├── models/             # Mongoose Lead schema with text indexing
│   │   ├── routes/             # Express API routes
│   │   ├── types/              # Backend interfaces & enums
│   │   ├── utils/              # Seed data for initial demo
│   │   ├── app.ts              # Express application config
│   │   └── server.ts           # Server bootstrap & graceful shutdown
│   ├── tests/                  # Supertest & Jest integration test suite
│   ├── Dockerfile              # Multi-stage Node.js container
│   └── package.json
├── docker-compose.yml          # Local full-stack cluster orchestration
├── render.yaml                 # Render PaaS deployment blueprint
├── AGENT.md                    # AI collaboration disclosure & prompt log
├── README.md                   # System documentation
└── package.json                # Monorepo task runner
```

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v20/v24)
- **NPM**: v9.0.0 or higher
- *(Optional)* **Docker & Docker Compose** for containerized run

---

### Option A: Run Locally (Recommended for Quick Evaluation)

Because of the built-in **in-memory MongoDB engine**, you do **not** need a running MongoDB daemon or Atlas cluster to test the application!

#### 1. Clone the repository
```bash
git clone <repository_url>
cd <repository_folder>
```

#### 2. Install dependencies
```bash
# From the root directory:
npm install
npm --prefix server install
npm --prefix client install
```

#### 3. Start development servers concurrently
```bash
npm run dev
```
- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/leads](http://localhost:5000/api/leads)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

*(The backend will automatically seed 6 realistic leads upon startup so the dashboard is immediately populated for demonstration).*

---

### Option B: Run with Docker Compose

To spin up the entire cluster (MongoDB 7.0 + Express Backend + React/Nginx Frontend) in isolated containers:

```bash
docker-compose up --build
```
Once initialized:
- Open [http://localhost:5173](http://localhost:5173) in your browser.

To stop the containers:
```bash
docker-compose down -v
```

---

### Option C: Connect to External MongoDB (e.g., MongoDB Atlas)

Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lead_tracker?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
```
Restart the server; Mongoose will automatically connect to your Atlas database.

---

## 🧪 Automated Testing

The backend includes a comprehensive integration test suite using **Jest** and **Supertest**, validating all HTTP response codes, data models, Zod validation failures, and search filters:

```bash
# Run server test suite
npm --prefix server test
```

### Test Coverage Highlights:
- `POST /api/leads`: Validates successful creation, rejects short names, invalid emails, and unsupported statuses.
- `GET /api/leads`: Tests pagination, case-insensitive search by name/email/phone, and status filters.
- `PATCH /api/leads/:id/status`: Tests inline status updates and rejection of invalid status strings.
- `DELETE /api/leads/:id`: Confirms deletion and verifies subsequent 404 responses.
- `GET /api/leads/stats`: Confirms aggregate status counts and win rate calculations.
- `GET /api/leads/export/csv`: Confirms proper `text/csv` headers and CSV structure.

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Query / Body Params |
|---|---|---|---|
| `GET` | `/api/health` | Service health status & uptime | None |
| `GET` | `/api/leads` | List leads (paginated, searchable) | `search`, `status`, `sortBy`, `sortOrder`, `page`, `limit` |
| `GET` | `/api/leads/:id` | Fetch single lead by MongoDB ID | None |
| `POST` | `/api/leads` | Create a new lead | `{ name, email, phone, status?, notes? }` |
| `PATCH` | `/api/leads/:id/status` | Fast update of lead status | `{ status }` |
| `PUT` | `/api/leads/:id` | Update lead record | `{ name?, email?, phone?, status?, notes? }` |
| `DELETE` | `/api/leads/:id` | Remove a lead from pipeline | None |
| `GET` | `/api/leads/stats` | Pipeline KPI metrics & win rates | None |
| `GET` | `/api/leads/export/csv` | Download full database in CSV format | None |

### Valid Lead Statuses
- `New` (Default for inbound leads)
- `Contacted`
- `In Progress`
- `Qualified`
- `Closed - Won`
- `Closed - Lost`

---

## 🌐 Deployment Instructions

### 1. Backend Deployment (Render / Railway / Fly.io)
1. Fork or push this repository to GitHub.
2. Create a **New Web Service** on [Render](https://render.com).
3. Set **Root Directory** to `server`.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm run start`
6. Add Environment Variables:
   - `PORT`: `5000` (or `10000` for Render)
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas URI
   - `CLIENT_ORIGIN`: Your deployed frontend URL (e.g. `https://your-frontend.vercel.app`)

### 2. Frontend Deployment (Vercel)
1. Create a **New Project** on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Framework Preset: `Vite`.
4. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (or configure rewrites in `vercel.json`).
5. Deploy!

---

## ⚖️ Architectural Decisions & Trade-offs

1. **Dual MongoDB Storage Strategy (Atlas / In-Memory Fallback)**:
   - *Rationale*: Technical assignments are often evaluated in isolated reviewer environments. Setting up cloud credentials or local daemons can delay evaluation. By providing a graceful fallback to `mongodb-memory-server`, reviewers can run `npm run dev` immediately while still testing real Mongoose models, queries, and aggregations.
   - *Trade-off*: In-memory mode does not persist data across server restarts, which is intentional for quick ephemeral evaluation. Real persistence is activated simply by passing `MONGODB_URI`.

2. **Express + TypeScript vs. NestJS**:
   - *Rationale*: For a focused assignment like Lead Tracker, Express with TypeScript and Zod offers superior clarity, minimal boilerplate, and blazingly fast cold starts, while maintaining 100% type safety.
   - *Trade-off*: Lacks NestJS's opinionated dependency injection container, which can be easily incorporated if the service scales into a large enterprise monolith.

3. **Vanilla CSS Design Tokens vs TailwindCSS**:
   - *Rationale*: Customized CSS custom properties and fine-tuned glassmorphic gradients provide a bespoke, distinct identity without relying on cookie-cutter utility classes, demonstrating core CSS competency.

---

## 🔮 Future Improvements & Roadmap

1. **Authentication & Multi-Tenant Role Access**: Implement JWT / OAuth2 (Google Workspace) with Role-Based Access Control (`Admin`, `Sales Rep`, `Viewer`).
2. **Activity Timeline & Audit Trail**: Log timestamped activity whenever a lead status changes, including notes, calls, and email history.
3. **Automated Email & Webhook Integrations**: Webhook triggers (Slack notification upon `Closed - Won`, automated email sequence via SendGrid upon inquiry submission).
4. **Drag-and-Drop Kanban**: Enhance the board view with `@hello-pangea/dnd` for smooth drag-and-drop card movements between columns.
5. **Real-time Collaboration via WebSockets**: Implement Socket.io to synchronize lead status changes across multiple concurrent sales agents in real time.
