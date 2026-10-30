# Workflow Protocol: How to Follow the E-commerce API Implementation Prompt

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
