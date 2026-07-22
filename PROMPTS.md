# 📜 PROMPTS.md — Prompt Engineering History & AI Workflow Narrative

This document logs the structured prompt engineering strategies, system personas, and generative AI templates used to build the **DriveHub Car Dealership Inventory System**.

---

## 🎯 Prompt 1: System Persona & Architecture Design

### **Prompt Strategy**: Architecture & System Design Blueprinting
```text
System Role: Senior Full-Stack Architect (10+ years experience in Python, FastAPI, and React)
Task: Design a production-ready monorepo architecture for a Car Dealership Inventory System.

Requirements:
- Backend: Python 3.9+, FastAPI, SQLAlchemy ORM, SQLite database.
- Security: OAuth2 Bearer JWT authentication, bcrypt password hashing, role-based access control (Admin vs Customer).
- Endpoints: Auth (register, login, me), Vehicles CRUD & search filter (make, model, category, price range), Inventory purchase (stock decrement), and Inventory restock (admin only).
- Standards: Clean Architecture (SOLID), separation of concerns (models, schemas, core security, api routers), and standardized API response/error envelopes.

Generate the ideal folder layout and database schema relationships.
```

### **AI Output & Impact**:
- Designed clean backend module structure (`app/config.py`, `app/database.py`, `app/models/`, `app/schemas/`, `app/core/`, `app/api/`).
- Defined ORM relations between `User`, `Vehicle`, and `Transaction`.

---

## 🎯 Prompt 2: TDD Pytest Test Suite Generation (Red-Green-Refactor)

### **Prompt Strategy**: Test-Driven Development (TDD) Engineering
```text
System Role: Principal QA & Backend Test Automation Engineer
Task: Generate a comprehensive Pytest test suite for a FastAPI Car Dealership API BEFORE writing endpoint implementations.

Test Scenarios Required:
1. Auth: Successful user registration, duplicate username rejection, valid JWT login, invalid password handling, and token validation (/api/auth/me).
2. Vehicles: Listing vehicles, keyword search, multi-filter search (category + price range), admin-only creation, customer forbidden error (403), admin update, and admin deletion.
3. Inventory: Purchase vehicle stock decrement, out-of-stock rejection (400), admin restock, and customer restock forbidden error (403).
4. Fixtures: In-memory SQLite with StaticPool connection isolation and FastAPI TestClient dependency overrides.

Deliver clean, production-grade Pytest code with coverage assertions.
```

### **AI Output & Impact**:
- Generated 18 automated test cases in `backend/tests/`.
- Diagnosed SQLite `:memory:` multi-threading connection isolation and applied `StaticPool`.

---

## 🎯 Prompt 3: Standardized API Response & Error Envelope Middleware

### **Prompt Strategy**: API Response Standardization Pattern
```text
System Role: API Standards & Middleware Architect
Task: Implement a unified API Response & Exception Handler system for FastAPI.

Requirements:
- Every HTTP 2xx response must return JSON:
  {
    "success": true,
    "status_code": 200,
    "message": "Human-readable summary",
    "data": { ... }
  }
- Every HTTP 4xx/5xx exception must return JSON:
  {
    "success": false,
    "status_code": 400|401|403|404|422|500,
    "message": "Detailed error explanation",
    "data": null
  }
- Register global exception handlers for HTTPException, RequestValidationError, and general Exception.
```

### **AI Output & Impact**:
- Created `app/core/response.py` and global exception handlers in `app/main.py`.
- Updated all API routers and test assertions to validate the standardized response envelope.

---

## 🎯 Prompt 4: React SPA & Luxury Glassmorphism Styling

### **Prompt Strategy**: Frontend UX & Design System Engineering
```text
System Role: Staff Frontend Engineer & UI Designer
Task: Build a luxury Single-Page Application (SPA) in React, Vite, and Tailwind CSS.

Design Specifications:
- Aesthetic: Modern dark mode glassmorphism UI, smooth micro-animations, Inter typography, Lucide React icons.
- Features:
  - Header Navbar with live user info, Admin status pill, and instant Demo Account Switcher buttons.
  - Search & Filter bar for keyword, category selection, and price range.
  - Interactive Vehicle Cards displaying price, specs, and real-time stock status badges ("In Stock", "Low Stock", "Out of Stock").
  - "Purchase" button disabled when stock quantity is 0 (as mandated by kata requirements).
  - Admin modals for vehicle creation, editing, deletion, and restocking.
  - Axios API client with automatic Bearer token injection and response envelope unpacking.
```

### **AI Output & Impact**:
- Created modular React frontend (`Navbar`, `SearchFilterBar`, `VehicleCard`, `VehicleModal`, `RestockModal`, `AuthModal`, `Toast`).
- Achieved zero-error Vite build (`npm run build`).

---

## 🎯 Prompt 5: AI Co-Author Git Commit Compliance

### **Prompt Strategy**: AI Governance & Git Version Control Standard
```text
System Role: DevOps & Code Governance Specialist
Task: Format all Git commits to strictly follow the AI Co-authorship policy.

Format Constraint:
Two empty lines after commit message, followed by:
Co-authored-by: Antigravity AI <ai@users.noreply.github.com>
```

### **AI Output & Impact**:
- Enforced transparent Git commit history tracking AI assistance across all features.
