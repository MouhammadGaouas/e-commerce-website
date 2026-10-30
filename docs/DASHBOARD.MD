# Task: Build an admin dashboard for the Next.js App Router app

## Context
- There is currently one dashboard at `app/dashboard/page.tsx` that uses `requireSession()` (`lib/session.ts`) and shows the signed-in user's own orders/stats/profile. Admins land on this same page.
- Admin capabilities exist only as API routes (`app/api/admin/orders/route.ts`, `app/api/admin/orders/[id]/route.ts`, and product CRUD in `app/api/products/route.ts` and `[id]/route.ts`), guarded inline by `user?.role === "admin"`.
- No admin UI pages exist. The Navbar (`components/layout/Navbar.tsx`) has a single `/dashboard` link for all logged-in users.

## Hard constraints
- Do NOT modify the customer dashboard (`app/dashboard/page.tsx`) or its behavior.
- Do NOT change API response shapes or status codes, except non-admins must still get the same 401/403 as before.
- Follow existing code conventions (styling, component patterns, data-access layer, error handling). Read neighboring files first and match them.
- No new dependencies unless unavoidable. If needed, tell me why before adding.
- Admin protection must be enforced server-side. Hiding UI is never the security boundary.

## Phase 1: Auth helper
1. In `lib/session.ts`, add `requireAdmin()` next to `requireSession()`:
   - For pages/layouts: if there is no session, behave like `requireSession()` (redirect to login). If the user is not an admin, redirect to `/dashboard` (or call `notFound()`; pick whichever matches current conventions and tell me which).
   - Returns the session user on success.
2. Add an API-side variant (e.g. `requireAdminApi()` or similar) that returns the user or a ready-made `401`/`403` JSON response, matching how the existing routes respond today.
3. Refactor all existing inline `user?.role === "admin"` checks in the API routes to use the API-side helper. Behavior must be identical.

## Phase 2: Shared service layer
1. Create `lib/services/orders.ts` (and `lib/services/stats.ts` if cleaner). Extract the query logic from `app/api/admin/orders/route.ts` and `[id]/route.ts` into functions such as:
   - `listOrders({ status?, page?, pageSize? })`
   - `updateOrderStatus(id, status)` (validate against the existing status enum/values)
   - `getPlatformStats()` returning: total revenue, total order count, order count by status, new users in the last 30 days, and the 5-10 most recent orders
2. Update the API routes to call these functions. Routes keep only auth, input parsing, and response formatting.
3. Server components must call these service functions directly. Do not fetch your own API routes from pages.
4. Compute stats with database-side aggregation (count/sum/groupBy), not by loading all rows into memory. Exclude cancelled/failed orders from revenue, and state in a comment which statuses count.

## Phase 3: Admin routes
1. Create `app/admin/layout.tsx` (server component) that calls `requireAdmin()` and renders a simple admin shell: page title, small sidebar or tab nav with links to Dashboard, Orders, and Products, plus a "Back to store" link. Reuse existing layout/UI components where possible.
2. Create `app/admin/dashboard/page.tsx`:
   - Stat cards: total revenue, total orders, new users (30d), orders awaiting action (e.g. pending/processing, use the real status names from the schema)
   - Orders-by-status breakdown
   - Recent orders table: order id, customer, total, status, date, with an inline control to change status
3. Status updates: implement as a Server Action (or a small client component calling the existing `PATCH`/`PUT` endpoint, whichever matches the codebase). Either way, the action must re-check admin via `requireAdmin()` itself, call `updateOrderStatus`, and `revalidatePath` for the admin pages. Show success/error feedback.
4. Create `app/admin/orders/page.tsx`: full paginated orders list with a status filter, reusing the same table component as the dashboard.
5. Create a minimal products UI at `app/admin/products/page.tsx`: list products with links/buttons for create and edit, backed by the existing product CRUD logic (extract to `lib/services/products.ts` if it makes the pages cleaner). If this makes the task too large, build only the list page and leave a clear TODO for create/edit. Tell me which you did.
6. Add `loading.tsx` and `error.tsx` for `app/admin`.

## Phase 4: Navigation
1. In `components/layout/Navbar.tsx`, show an "Admin" link to `/admin/dashboard` only when the user's role is `admin` (both desktop and mobile menus). Keep the existing `/dashboard` link for everyone.
2. Do not auto-redirect admins away from `/dashboard`.

## Phase 5: Verification
- Run typecheck, lint, and any existing tests; fix anything you broke.
- Add tests for `requireAdmin()` and for `getPlatformStats()` / `updateOrderStatus()` if a test setup exists.
- Manually confirm and report results for each case:
  1. Logged-out user visiting `/admin/dashboard` is redirected to login.
  2. Customer visiting `/admin/dashboard` is blocked.
  3. Admin visiting `/admin/dashboard` sees stats and orders.
  4. Customer calling the admin API routes still gets 403.
  5. Admin changing an order status updates the DB and the UI.
  6. Customer dashboard is unchanged.

## Deliverable
Work phase by phase. After each phase, summarize the files changed and anything ambiguous you decided. At the end, give a short list of follow-ups you noticed but did not do (e.g. audit logging for admin actions, product create/edit if skipped).