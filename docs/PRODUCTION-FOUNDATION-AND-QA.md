# My Dose — Production Foundation & QA

## What is implemented in the prototype

- One normalized member-state contract drives Today, Journey, Rewards, and You.
- One progress engine calculates streaks, lessons, badge thresholds, challenge thresholds, and milestone state.
- Progress persists locally between refreshes using versioned browser storage.
- Today actions update Journey, Rewards, challenge progress, points, and activity history from the same state.
- Badge, challenge, Day 24, Day 72, and Day 90 celebrations have intentionally different visual intensity.
- Leadership demo controls expose important lifecycle scenarios without changing production decision rules.
- A lightweight analytics seam records prototype events to `window.__MY_DOSE_EVENTS__` and can later be replaced by RudderStack.
- Production adapter contracts define where passwordless identity, Shopify, Skio, and persisted routine state connect.
- A resilient async contract now standardizes success, empty, stale, timeout, retry, and error behavior.
- The global experience shell handles offline/restored connectivity and accessible status toasts.
- First-load hydration is masked with a short branded boot transition so persisted state does not visually jump after mount.
- Framework-level loading, error, and not-found experiences use the same Dose visual system as the main product.
- `/states` exposes loading, empty, error, stale, saving, and success states for design and QA review.

## What is intentionally not represented as a live production integration

This public prototype does not contain Shopify, Skio, auth, RudderStack, Mixpanel, Klaviyo, HealthKit, or other credentials. `app/lib/productionAdapters.js` is the integration seam, not a claim that those systems are connected.

## Production sequence

1. Passwordless auth and canonical `dose_customer_id`.
2. Server-side BFF/API layer.
3. Shopify order/customer reads.
4. Skio subscription reads and approved mutations.
5. Server-persisted routine state and idempotent routine actions.
6. Authoritative reread after subscription/order mutations.
7. RudderStack event delivery to Mixpanel/Klaviyo/warehouse using the existing event taxonomy.
8. Treatment/holdout pilot instrumentation and retention outcome measurement.

## Resilient UI doctrine

### Reads
- Show skeletons that preserve final layout dimensions.
- Retry short-lived failures once where safe.
- Use last-known-good data when available and label it as stale.
- Never replace useful cached data with an empty white screen solely because a refresh failed.
- Empty states should explain what creates content and offer one relevant next action.

### Mutations
- The interface may optimistically acknowledge low-risk routine interactions, but production state remains authoritative.
- Payment, subscription, order, and account mutations must not display success until the source of truth confirms the change.
- Failed mutations must preserve or restore the previous known-good state.
- Errors should remain in context with retry/support paths rather than ejecting the member from the flow.
- Offline mode may browse cached data but must not silently queue financial or subscription mutations as if they succeeded.

### Feedback
- Small success events use restrained toast or inline feedback.
- Milestones use the existing celebration hierarchy.
- Connectivity banners appear only when useful, then get out of the way.
- Error copy explains impact first: what changed, what did not change, and what the member can do next.

## QA checklist for this feature pass

### State integrity
- Daily Dose completion changes the single shared progress state.
- Streak, points, Journey calendar, challenges, badges, and activity history derive from the same state.
- Refresh retains prototype progress.
- Reset removes persisted demo progress.
- At-risk and payment-failed scenarios still use the Home priority engine.

### Resilient state UX
- `app/loading.js` preserves visual structure with branded skeletons.
- `app/error.js` makes clear that account/subscription state was not changed and provides retry.
- `app/not-found.js` returns the member to My Dose without a generic framework screen.
- Offline banner is persistent while offline and disappears after connection restoration.
- Reconnection gets a short confirmation state.
- Toasts are announced with `aria-live` and can be dismissed.
- `/states` previews Loading / Empty / Error / Stale / Saving / Success.
- Stale state visibly communicates data freshness.
- Saving state distinguishes immediate interaction from server confirmation.
- Local-storage failures degrade gracefully and explain persistence risk.

### Adapter / API contract
- Reads return normalized result objects rather than leaking vendor-specific error shapes into the UI.
- Read policy supports timeout, one retry, and optional last-known-good fallback.
- Mutation policy does not retry by default because duplicate mutations can be unsafe.
- Production subscription/payment mutations require authoritative confirmation.
- Vendor secrets remain server-side and outside this public repository.

### Celebration hierarchy
- Routine completion remains subtle.
- Badge unlock uses the badge takeover.
- Challenge completion uses the major milestone takeover.
- Day 24 and Day 72 use major treatment.
- Day 90 uses legendary treatment.
- Escape/close buttons dismiss full-screen celebrations.
- Body scroll is locked while a takeover is open.
- Reduced-motion users receive a static equivalent without falling confetti/orbit animation.

### Journey
- Current day is visually distinct from selected day and completed days.
- Calendar buttons have descriptive accessible labels.
- Live actions appear at the top of activity history.
- Challenge progress uses live streak/lesson/journey values.
- Wellness copy remains descriptive and non-causal.

### Demo controls
- Demo button remains secondary to member UI.
- Day 7, 24, 72, and 90 are triggerable.
- At-risk and payment-failed states are triggerable.
- Review and challenge celebrations are triggerable.
- Production-state QA is linked directly from Demo controls.
- Keyboard shortcut and Escape dismissal are available for demos.

### Visual quality
- Canonical Dose cream/forest-green system remains the shared visual authority.
- Major surfaces use consistent radii, borders, elevation, and spacing.
- Touch targets remain at least ~44px.
- Loading/error states feel like My Dose, not generic infrastructure UI.
- Skeletons avoid large layout shifts.
- Celebration colors stay inside the Dose neutral/green palette.
- No health data, PII, credentials, or vendor secrets are committed.

## Remaining QA before customer pilot

A successful Vercel build validates compilation, but customer-pilot readiness still requires real-device visual regression testing on current iPhone/Android sizes, keyboard/focus testing, screen-reader testing, true network throttling/offline testing, production API contract tests, subscription mutation sandbox testing, and analytics delivery validation.
