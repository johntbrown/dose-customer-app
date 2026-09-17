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

## QA checklist for this feature pass

### State integrity
- Daily Dose completion changes the single shared progress state.
- Streak, points, Journey calendar, challenges, badges, and activity history derive from the same state.
- Refresh retains prototype progress.
- Reset removes persisted demo progress.
- At-risk and payment-failed scenarios still use the Home priority engine.

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
- Keyboard shortcut is available for demos.

### Visual quality
- Canonical Dose cream/forest-green system remains the final shared visual authority.
- Major surfaces use consistent radii, borders, elevation, and spacing.
- Touch targets remain at least ~44px.
- Celebration colors stay inside the Dose neutral/green palette.
- No health data, PII, credentials, or vendor secrets are committed.

## Remaining QA before customer pilot

A successful Vercel build validates compilation, but customer-pilot readiness still requires real-device visual regression testing on current iPhone/Android sizes, keyboard/focus testing, screen-reader testing, network/error-state testing, production API contract tests, and analytics delivery validation.
