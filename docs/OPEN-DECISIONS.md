# My Dose Open Decisions Register

_Last updated: September 15, 2026_

## Purpose

Track decisions that materially affect architecture, data ownership, rollout, cost, privacy or the member experience. These should not remain buried in Slack, meetings or vendor UIs.

## Decision format

Each decision should capture:
- owner
- target date
- options
- decision criteria
- current recommendation
- downstream dependencies
- final decision / ADR link

## 1. Client direction

### Question
Does the production pilot remain a responsive/PWA Next.js experience, move to React Native, or use another client approach?

### Current position
The current prototype proves the UX in Next.js/PWA. V1 engineering should avoid coupling domain services to the client so a later native client remains possible.

### Criteria
- time to pilot
- push/reminder requirements
- app-store distribution need
- offline/background behavior
- internal engineering expertise
- shared web/account experience
- long-term maintenance cost

### Owner
Product + Engineering.

## 2. Authentication provider

### Need
Passwordless magic-link/SMS experience with secure sessions and customer-account matching.

### Requirements
- supports chosen client architecture
- rate limiting / abuse protection
- clear account recovery
- integration with canonical `dose_customer_id`
- no duplicate Shopify-account identity model

### Blocks
Identity epic, production pilot.

## 3. Canonical `dose_customer_id` ownership

### Question
Where is the canonical ID generated and persisted?

### Recommendation
Dose-owned identity layer / durable warehouse-compatible mapping, not a vendor-specific external ID.

### Must define
- generation
- merge behavior
- duplicate handling
- deleted accounts
- anonymous-to-known alias behavior

## 4. App datastore

### Need
Small first-party store for app-specific state only.

### Required entities
- app users / identity map
- onboarding state
- routine logs
- check-ins
- education progress
- preferences
- feature flags/assignments if not external
- recommendation exposures
- service state if needed

### Decision criteria
- relational integrity
- operational simplicity
- Vercel/hosting fit
- auditability
- migration/backups

## 5. Warehouse / BigQuery interface

### Question
How should production app services consume derived customer state from the existing data foundation?

Options may include:
- materialized operational table + API/cache
- CDP-propagated properties
- direct warehouse read only for non-latency-sensitive state

### Guardrail
Do not make customer-facing operational actions depend on slow/batch warehouse state when Skio/Shopify is authoritative.

## 6. Shopify API and fulfillment/tracking source

Need to confirm:
- Shopify API surface/version
- fulfillment objects available
- whether carrier tracking details are sufficient through Shopify
- whether a separate tracking provider is needed
- webhook strategy

## 7. Skio API capabilities

Confirm production support for:
- read subscription
- skip
- change next charge/order date
- quantity
- cadence
- product swap/add
- pause
- cancellation/save-flow handoff
- webhook/event coverage

Every supported action must map to explicit app eligibility rules and verification.

## 8. RudderStack identity/event implementation

Decide:
- client SDK vs server event ownership by event class
- alias/identify behavior
- schema validation location
- retry/offline strategy
- destination filtering for sensitive properties

## 9. Push/reminder provider

Need:
- platform support based on final client
- permission flow
- user-controlled timing
- timezone behavior
- lifecycle orchestration with Klaviyo/Postscript where relevant
- deep links
- experiment support

## 10. Content/CMS implementation

Requirements:
- education/articles/guides/recipes
- milestone content
- product/lifecycle tags
- claims/disclaimer metadata
- preview
- versioning
- approval workflow
- scheduled publishing

Avoid overbuilding a bespoke CMS if a suitable existing platform can satisfy requirements.

## 11. Rules / feature flag platform

Question:
Should deterministic NBA/recommendation rules and feature flags use an existing platform or a lightweight Dose-owned config layer?

Keep separate concepts:
- business rules = eligibility/routing
- feature flags = rollout/kill switches/experiments

## 12. TAPP migration/backfill

Confirm:
- available user-level export
- module/click/completion history
- identity keys
- event timestamps
- mapping to native education/check-in model

If reliable backfill is not possible, define a clear cutover boundary rather than pretending history is complete.

## 13. Concierge / nutritionist booking provider

Need:
- booking URL/API
- eligibility state
- booking-start/completed signal
- appointment status access
- cancellation/reschedule behavior

Consumer app should not become a clinical-note store.

## 14. Loyalty / referral system of record

Confirm platform(s) and APIs for:
- points/status if applicable
- milestone benefit eligibility
- gift/credit status
- redemption
- referral state
- commitment/annual plan interactions

## 15. Pilot cohort

Define:
- products included
- subscriber cycles included
- geography/platform constraints
- exclusions
- treatment/holdout split
- invitation mechanism
- pilot size
- support capacity

Recommendation: subscriber-first and narrow enough to diagnose problems quickly.

## 16. Production KPI definitions

Lock with Analytics/Data:
- D24 survival denominator/numerator
- D48
- D72
- D90
- M3 retention
- app activation
- adherence
- service engagement
- cross-sell incrementality
- LTV window

Do not allow app reporting to create competing definitions with Retention Intelligence / warehouse reporting.

## 17. Health/wellness-data retention

Before collecting optional health markers, define:
- exact fields
- consent
- retention period
- deletion/export behavior
- analytics destinations
- internal access
- medical/privacy review

## 18. Admin/internal operating layer

Current recommendation: build only controls needed to operate the member experience:
- content
- rules
- flags
- basic member-state troubleshooting/audit

Do not build a standalone Retention/CX dashboard if Mixpanel, warehouse/BI and existing support tools can handle the use case.

## 19. Decision priority

### Must resolve before Phase 1 implementation
- client direction for pilot
- auth
- canonical identity owner
- datastore
- Shopify/Skio API contracts
- RudderStack identity/event plan
- environment/secrets model

### Must resolve before Phase 2
- CMS/content
- reminders/push
- booking
- TAPP cutover

### Can defer to Phase 4/P1
- loyalty/referral platform details
- broader commerce expansion
- richer health-marker integrations

## 20. Decision rule

Resolve decisions when they block a production dependency or create expensive architectural rework. Do not force premature decisions on V2/V3 features merely to make documentation look complete.