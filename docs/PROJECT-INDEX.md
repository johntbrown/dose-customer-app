# My Dose Project Index

_Last updated: September 15, 2026_

This file is the front door to the My Dose product repository. It separates **current decisions**, **prototype behavior**, **production requirements**, and **open decisions** so the project does not drift as design and engineering move in parallel.

## 1. Product decision

My Dose is a **subscriber-first member companion** and retention product. It is not a second storefront and not a new customer-data platform.

North-star question:

> What is the most useful thing for this member to do today?

Every V1 feature should map to one of five member jobs:

1. routine guidance
2. progress / expectation setting
3. next-best action / personalization
4. support / services
5. subscription and account control

## 2. Business objective

The app exists to improve **subscription survival and LTV**, especially through the first 90 days. DAU/WAU, streaks, content completion and push opt-in are diagnostic metrics, not the business outcome.

Retention windows:
- D0: establish routine and expectations
- D24: protect first rebill / make next order clear
- D48: prove value, check in, right-size or support
- D72: reinforce proof and habit
- D90: reflect, reward and move into the longer-term journey

## 3. Current repository state

### Working prototype
The current app includes:
- first-login splash
- member home / Today
- product education
- Liver Masterclass
- expectation/results timeline
- order tracking concept
- Discover / product recommendation concept
- user/member portal
- subscription-management concept
- live Dose design-system overrides

### Current limitations
- mock identity
- mock customer state
- mock subscription/order/tracking data
- no production Skio writes
- no production Shopify reads
- no auth
- no live RudderStack instrumentation
- no production Mixpanel dashboards
- no admin/CMS/rules layer
- no release/rollback automation documented in code yet

## 4. Source-of-truth documentation map

| Question | Document |
| --- | --- |
| What are we building? | `PRODUCT-REQUIREMENTS-V1.md` |
| How is the app structured? | `BACKEND-ARCHITECTURE-V0.9.md` |
| Which system owns each field? | `DATA-CONTRACTS.md` |
| What APIs should the client use? | `API-CONTRACTS.md` |
| What events do we emit? | `EVENT-TAXONOMY.md` |
| How do content/personalization rules work? | `CONTENT-AND-RULES.md` |
| How do we measure success? | `EXPERIMENTATION-AND-MEASUREMENT.md` |
| How do we ship safely? | `QA-RELEASE-RUNBOOK.md` |
| What are privacy/medical boundaries? | `SECURITY-PRIVACY-MEDICAL.md` |
| Who owns what? | `OPERATING-MODEL.md` |
| What ships when? | `ROADMAP.md` |
| What does complete mean? | `DEFINITION-OF-DONE.md` |
| What visual system is canonical? | `DOSE-DESIGN-SYSTEM.md` |

## 5. Existing systems and ownership

- Shopify: commerce, customer and order truth
- Skio: subscription truth and approved subscription mutations
- Klaviyo: lifecycle email/SMS activation
- RudderStack: event routing and identity-aware transport
- Mixpanel: product behavior analysis
- Warehouse/BI: durable history, official retention/LTV/business definitions
- TAPP: interim education/check-ins/ZPD while native replacement is built
- Okendo: reviews/social proof where relevant
- Existing service layer: concierge/nutritionist booking
- Loyalty/referral: integrate existing/selected systems, do not create custom ledger in V1

## 6. Canonical state principle

The app consumes one normalized member-state object keyed by `dose_customer_id`.

Complex product/subscription/lifecycle logic should be calculated upstream and exposed to the app as stable fields. Do not reproduce the current pattern of repeatedly evaluating overlapping raw SKU/subscription fields throughout each journey.

Events represent **actions/timing**. Properties represent **current state/eligibility**.

## 7. Product-state dimensions the architecture must preserve

- primary product
- owned products / bundle status
- serving size / oz where still meaningful
- active subscriber status
- subscription cycle/order count
- next bill / next ship
- lifecycle month/day
- routine start date
- serving goal
- reminder preferences
- streak/adherence
- M1/M2/M3 check-in state
- support need
- concierge/nutritionist eligibility and usage
- commitment/annual-plan eligibility and status
- review eligibility
- cross-sell target
- loyalty/reward state
- referral eligibility
- goals/ZPD
- bloodwork interest
- content/service preferences
- churn-risk state
- next-best action
- experiment assignment

## 8. Explicit V1 boundaries

Do not build in V1:
- standalone ecommerce storefront
- custom subscription engine
- custom payments
- custom loyalty economy
- full telehealth platform
- autonomous medical advice
- native social network
- broad wearables
- custom video infrastructure
- standalone CX/Retention dashboard when existing tools can serve the use case

## 9. Current highest-priority engineering work

1. Resolve branch/architecture divergence between the current main prototype and open product-foundation work.
2. Finalize auth and `dose_customer_id` identity resolution.
3. Define and implement customer-state contracts.
4. Add server-side Shopify and Skio adapters.
5. Implement RudderStack event contract and schema validation.
6. Stand up dev/staging/prod environment conventions and secrets handling.
7. Convert mock actions to integration-safe read/write paths.
8. Add feature flags/experiment assignments.
9. Add CMS/config for education, milestones and recommendations.
10. Add automated tests, accessibility checks, observability and rollback.
11. Run controlled internal QA and a pilot cohort before broad launch.

## 10. Open product/technical decisions

- auth provider / passwordless implementation
- canonical owner and generation logic for `dose_customer_id`
- exact warehouse/BigQuery consumption interface
- exact carrier/tracking source
- loyalty/referral system of record
- concierge/nutritionist booking provider integration
- push notification provider and permission strategy
- TAPP historical export/backfill availability
- CMS/config implementation
- data-retention policy for app check-ins and optional health-marker inputs
- pilot cohort definition and holdout design
- native vs PWA/React Native longer-term client direction

## 11. Repository hygiene rule

Any meaningful new product capability should ship with:
- product requirement update
- data/source-of-truth mapping
- event instrumentation
- analytics acceptance criteria
- security/privacy review where applicable
- QA states and failure behavior
- rollout/feature-flag plan
- documentation update

A screen without its data contract, event contract and failure state is not considered production-ready.