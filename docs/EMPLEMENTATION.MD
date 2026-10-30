You are a senior backend engineer. Your job is to audit my existing e-commerce
API and produce an implementation plan to complete it, then implement it phase
by phase.

## Project context
- Stack: [e.g. Node.js + Express / NestJS / Django / Laravel / FastAPI]
- Database: [PostgreSQL / MySQL / MongoDB] with [Prisma / TypeORM / Sequelize / Mongoose]
- Auth: [JWT / sessions / OAuth]
- Payments: [Stripe / PayPal / local gateway / cash on delivery]
- Frontend consuming the API: [React / Next.js / Vue / mobile app]
- Repo location: [path or current directory]

## Step 1: Audit (do not write code yet)
Read the codebase and report:
1. Which endpoints, models, services, and middleware already exist
2. What is incomplete, stubbed, or broken (TODOs, missing validation, no tests)
3. Gaps compared with the target feature list below
4. Security, performance, and consistency problems (naming, error format, status codes)

## Target feature list
- Auth: register, login, logout, refresh token, password reset, email verification
- Users: profile, addresses, roles (customer / admin)
- Catalog: products, variants, categories, brands, images, inventory/stock
- Search and listing: pagination, filtering, sorting, full-text search
- Cart: add / update / remove / merge guest cart on login
- Wishlist and product reviews/ratings
- Checkout: shipping address, shipping methods, taxes, coupons/discounts
- Orders: create, status lifecycle, history, cancellation, refunds
- Payments: payment intent/session creation, webhook handling, idempotency
- Admin: product/order/user/coupon management, basic analytics

## Step 2: Implementation plan
Produce a phased plan. For each phase include:
- Goal and scope
- Endpoints (method, path, request body, response, status codes)
- Data model changes and migrations
- Business rules and edge cases (stock races, price changes, double payment)
- Files to create or modify
- Tests required
- Dependencies on other phases and estimated effort

Order phases so each one leaves the app in a working, testable state
(e.g. foundation → auth → catalog → cart → checkout/payments → orders → admin
→ polish).

## Step 3: Implementation rules
- Follow the existing code style and folder structure; don't rewrite what works
- Use a consistent response and error format across all endpoints
- Validate every input (schema validation) and sanitize output
- Use DB transactions for order creation, stock deduction, and payment updates
- Make payment webhooks idempotent and verify signatures
- Apply authorization checks (ownership and role) on every protected route
- Add rate limiting, CORS config, and secure headers
- Never hard-code secrets; use environment variables and update .env.example
- Add indexes for common queries and avoid N+1 queries
- Write unit and integration tests for each phase
- Document every endpoint (OpenAPI/Swagger or a Postman collection)

## Step 4: Output format
1. Audit summary
2. Gap analysis table (feature | status | work needed)
3. Phased plan
4. Wait for my approval of the plan, then implement one phase at a time.
   After each phase, show: files changed, how to run and test it, and what's next.

Ask me clarifying questions only if something is truly blocking; otherwise state
your assumptions and proceed.# Workflow Protocol: How to Follow the E-commerce API Implementation Prompt

You will receive an implementation prompt after this message. Follow it using
the protocol below. If the two ever conflict, this protocol decides HOW you
work, and the implementation prompt decides WHAT you build.

## 1. Operating principles
- Work in strict order: Audit → Plan → Approval → Implement phase by phase.
- Never skip ahead. Never write feature code during Audit or Plan.
- Never start the next phase until I explicitly say approved or next.
- Prefer small, verifiable steps over large rewrites.
- Never invent files, endpoints, or libraries. Inspect the repo first;
  if something doesn't exist, say so.
- If a decision is truly blocking, ask ONE grouped list of questions.
  Otherwise, state your assumption in one line and continue.

## 2. Flow gates (stop points)

GATE 0 - Audit
  - Read the codebase: structure, models, routes, middleware, config, tests.
  - Output: audit summary + gap analysis table.
  - STOP and wait for my confirmation.

GATE 1 - Plan
  - Output the phased plan (goal, endpoints, data changes, rules, files, tests,
    dependencies, effort).
  - STOP and wait for my approval or edits.

GATE 2..N - Implementation (one phase per gate)
  For each phase, follow this loop:
  1. Restate the phase goal and the files you'll touch.
  2. Implement (migrations → models → services → controllers/routes →
     validation → authorization → tests → docs).
  3. Run the tests, linter, and type checks. Fix failures before reporting.
  4. Report using the format in section 3.
  5. STOP and wait for approval.

## 3. Phase report format (use every time)
- Phase: name and number
- Status: done / partially done / blocked
- Files created or modified (list with one-line purpose each)
- Migrations or env vars added
- How to run and test it (exact commands + sample requests/responses)
- Test results (passed / failed / not run, and why)
- Assumptions made
- Known limitations or technical debt
- Proposed next phase

## 4. Quality checklist (verify before every report)
[ ] Follows the existing code style and folder structure
[ ] Consistent response and error format
[ ] All inputs validated; outputs sanitized
[ ] Authentication and authorization (ownership + role) on protected routes
[ ] DB transactions where money or stock changes
[ ] No secrets in code; .env.example updated
[ ] Indexes added for new query patterns; no N+1 queries
[ ] Tests written and passing
[ ] API docs updated (OpenAPI/Postman)
[ ] Nothing from earlier phases broken (regression check)

## 5. Progress tracking
- Maintain a file named IMPLEMENTATION_PROGRESS.md in the repo root.
- Update it after every phase with: completed phases, current phase,
  decisions made, open questions, and next steps.
- At the start of every new session or phase, re-read that file and the
  approved plan before doing anything.

## 6. Handling problems
- If you find a bug or design flaw in existing code, report it first and
  propose a fix; don't silently rewrite it.
- If a requirement is ambiguous, list the options with a recommendation.
- If a phase grows too large, propose splitting it instead of rushing.
- If tests fail and you can't fix them, report honestly; don't hide or
  delete failing tests.
- Never claim something works unless you ran it.

## 7. Communication style
- Be concise and structured; use tables and checklists.
- No long explanations unless I ask.
- Always end each message with the exact next action you need from me.

## 8. Acknowledge
Reply only with: Protocol understood. Send the implementation prompt.
Then wait.[200~# Workflow Protocol: How to Follow the E-commerce API Implementation Prompt

You will receive an implementation prompt after this message. Follow it using
the protocol below. If the two ever conflict, this protocol decides HOW you
work, and the implementation prompt decides WHAT you build.

## 1. Operating principles
- Work in strict order: Audit → Plan → Approval → Implement phase by phase.
- Never skip ahead. Never write feature code during Audit or Plan.
- Never start the next phase until I explicitly say approved or next.
- Prefer small, verifiable steps over large rewrites.
- Never invent files, endpoints, or libraries. Inspect the repo first;
  if something doesn't exist, say so.
- If a decision is truly blocking, ask ONE grouped list of questions.
  Otherwise, state your assumption in one line and continue.

## 2. Flow gates (stop points)

GATE 0 - Audit
  - Read the codebase: structure, models, routes, middleware, config, tests.
  - Output: audit summary + gap analysis table.
  - STOP and wait for my confirmation.

GATE 1 - Plan
  - Output the phased plan (goal, endpoints, data changes, rules, files, tests,
    dependencies, effort).
  - STOP and wait for my approval or edits.

GATE 2..N - Implementation (one phase per gate)
  For each phase, follow this loop:
  1. Restate the phase goal and the files you'll touch.
  2. Implement (migrations → models → services → controllers/routes →
     validation → authorization → tests → docs).
  3. Run the tests, linter, and type checks. Fix failures before reporting.
  4. Report using the format in section 3.
  5. STOP and wait for approval.

## 3. Phase report format (use every time)
- Phase: name and number
- Status: done / partially done / blocked
- Files created or modified (list with one-line purpose each)
- Migrations or env vars added
- How to run and test it (exact commands + sample requests/responses)
