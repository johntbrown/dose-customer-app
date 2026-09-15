# My Dose — Customer App & Digital Member Experience

A subscriber-first member companion for Dose. The product goal is to turn lifecycle from a sequence of disconnected messages into a persistent customer experience that helps members build a routine, understand what to expect, manage their subscription, get support, and discover the next relevant action.

## Product north star

**What is the most useful thing for this member to do today?**

The app should answer five durable member questions:

1. **What should I do today?** Routine, reminders, check-ins, next-best action.
2. **Is this working?** Expectations, milestones, progress, 90-day journey.
3. **What should I do next?** Personalized education, services, rewards, product guidance.
4. **I need help.** Concierge, clinical nutritionist, FAQs, support, community.
5. **I need to change something.** Orders, skip/change date, quantity, product, account actions.

## Business outcome

Success is **subscription survival and LTV**, not app engagement for its own sake. Feature metrics are diagnostic. The first 90 days are the critical retention window:

- **Day 0:** routine setup and expectation setting
- **Day 24:** rebill protection and next-order clarity
- **Day 48:** proof/value, check-in, service/right-size
- **Day 72:** milestone, habit reinforcement, results framing
- **Day 90:** reflection, reward, next journey

Primary business measurement should include D24/D48/D72 retention, subscription survival, LTV, adherence, service usage, loyalty redemption, cross-sell, and experiment holdouts.

## Product scope

### P0 / V1
- Passwordless auth / account matching
- My Dose home
- Daily routine: taken / later / skip
- Streaks and adherence
- Member-controlled reminders
- M1 / M2 / M3 check-ins
- Personalized education by product, goal, lifecycle stage, and behavior
- Approved Skio subscription actions
- Shopify order + tracking context
- Concierge + clinical nutritionist access
- Results/expectations journey
- Structured events through RudderStack
- Mixpanel product analytics

### P1
- Rewards and milestone benefits
- Content library / recipe eBooks
- Push lifecycle
- Community entry points
- More sophisticated recommendation rules
- Native referral and benefits surfaces

### Explicit V1 non-goals
- Custom subscription engine
- Custom payment processor
- Full ecommerce storefront
- Standalone CX/Retention dashboard
- AI doctor / autonomous diagnosis
- Full telehealth platform
- Complex gamification economy
- Broad wearable ecosystem
- Custom video platform

## System-of-record boundaries

My Dose is an **experience and orchestration layer**, not a replacement data platform.

| Domain | Owner |
| --- | --- |
| Commerce, customers, orders | Shopify |
| Subscription state + approved mutations | Skio |
| Email/SMS activation | Klaviyo |
| Event routing / identity-aware transport | RudderStack |
| Behavioral product analytics | Mixpanel |
| Durable retention/LTV/history | Warehouse / BI |
| Interim education/check-ins/ZPD | TAPP |
| Reviews | Okendo |
| Concierge / nutritionist | Existing service/booking layer |

## Canonical member state

Every authenticated member should resolve to a canonical `dose_customer_id` that maps Shopify, Skio, Klaviyo, RudderStack and app-auth identities. The normalized state model includes subscription, lifecycle, routine, engagement, goals/ZPD, support need, loyalty, churn risk, next-best action, recommendation eligibility and progress.

## Current prototype

The repository currently includes a mobile-first Next.js demo with:

- first-login splash
- Today / member home
- product education + Liver Masterclass
- expectations timeline
- order tracking concept
- Discover / cross-sell concept
- member portal based on the onsite portal design
- subscription-management concept
- Dose live-theme design system
- mock customer states for Month 1 active, Month 2 at risk, Month 4 engaged

The demo is intentionally mock-first. Production integrations are documented separately and should be connected behind server-side adapters rather than directly from React components.

## Architecture

```text
App UI
  ↓
App API / Backend-for-Frontend
  ↓
Customer State + Domain Services
  ↓
Shopify / Skio / Content / Services / Rewards / Tracking
  ↓
RudderStack
  ↘ Mixpanel
  ↘ Klaviyo
  ↘ Warehouse / BI
```

V1 should be implemented as a **modular monolith**, not microservices. Clear domain boundaries matter; distributed infrastructure does not yet.

## Repository documentation

### Product + experience
- [`docs/PROJECT-INDEX.md`](docs/PROJECT-INDEX.md) — source-of-truth map for this repository
- [`docs/PRODUCT-REQUIREMENTS-V1.md`](docs/PRODUCT-REQUIREMENTS-V1.md) — V1 PRD, scope, journeys, acceptance criteria
- [`docs/APP-FUNCTIONS-V0.8.md`](docs/APP-FUNCTIONS-V0.8.md) — current splash + portal functions
- [`docs/EDUCATION-V0.md`](docs/EDUCATION-V0.md) — native education/TAPP migration approach
- [`docs/DOSE-DESIGN-SYSTEM.md`](docs/DOSE-DESIGN-SYSTEM.md) — live-theme design-system reference

### Engineering + data
- [`docs/BACKEND-ARCHITECTURE-V0.9.md`](docs/BACKEND-ARCHITECTURE-V0.9.md) — backend/service architecture
- [`docs/DATA-CONTRACTS.md`](docs/DATA-CONTRACTS.md) — canonical member-state and source-of-truth contracts
- [`docs/API-CONTRACTS.md`](docs/API-CONTRACTS.md) — API/BFF contract outline
- [`docs/EVENT-TAXONOMY.md`](docs/EVENT-TAXONOMY.md) — RudderStack/Mixpanel/Klaviyo event contract
- [`docs/CONTENT-AND-RULES.md`](docs/CONTENT-AND-RULES.md) — CMS, education, next-best-action, cross-sell rules

### Delivery + governance
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — phased build plan and exit criteria
- [`docs/EXPERIMENTATION-AND-MEASUREMENT.md`](docs/EXPERIMENTATION-AND-MEASUREMENT.md) — retention/LTV measurement framework
- [`docs/SECURITY-PRIVACY-MEDICAL.md`](docs/SECURITY-PRIVACY-MEDICAL.md) — security, consent, privacy and medical boundaries
- [`docs/QA-RELEASE-RUNBOOK.md`](docs/QA-RELEASE-RUNBOOK.md) — environments, QA, release, rollback and incident handling
- [`docs/OPERATING-MODEL.md`](docs/OPERATING-MODEL.md) — ownership, decision rights and cross-functional operating model
- [`docs/DEFINITION-OF-DONE.md`](docs/DEFINITION-OF-DONE.md) — engineering/product completion gates

## Environments

1. **Local** — developer environment
2. **Preview** — branch/PR QA
3. **Staging** — integration validation with non-production/test identities
4. **Demo** — stable leadership/stakeholder experience
5. **Production Pilot** — controlled customer cohort
6. **Production** — broader rollout after pilot exit criteria

## Delivery principles

- Preserve explicit system-of-record boundaries.
- Use normalized customer-state properties rather than re-deriving the same logic in every surface.
- Events for **things that happened**; properties for **current state/eligibility**.
- Start next-best-action logic deterministic and auditable.
- All meaningful app behavior emits a structured event.
- Every write action is authorized server-side and re-reads the authoritative system before UI confirmation.
- Business users should be able to manage ordinary content and recommendation rules without an app release.
- No sensitive/clinical expansion without explicit privacy and medical review.
- Dose owns source code, schemas, documentation and deployment assets.

## Current status

**Prototype + architecture phase, September 2026.** The current priority is converting the polished demo into an authenticated pilot with canonical identity, customer-state services, production integrations, instrumentation, QA/release controls, and a controlled retention experiment.