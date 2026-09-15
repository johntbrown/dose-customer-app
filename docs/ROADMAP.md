# My Dose Delivery Roadmap

## Principle

Sequence work to de-risk **identity + integrations + measurement** before broadening feature scope. The first 90-day member journey is the product spine; infrastructure exists to make that journey reliable and measurable.

## Phase 0 — Reconcile + lock architecture

### Objective
Move from prototype experimentation to one buildable product foundation.

### Deliverables
- reconcile `main` with open product-foundation branch / eliminate duplicate architecture
- final V1 PRD
- canonical navigation + information architecture
- canonical design system
- identity/data model
- source-of-truth matrix
- API contracts
- event taxonomy
- security/privacy boundary
- risk register
- final V1 exclusions

### Exit criteria
- one agreed code path
- no competing app shells/design systems
- Product + Engineering + Data sign off on identity/state ownership
- V1 P0 list frozen enough to sprint

## Phase 1 — Foundation

### Objective
Create a production-safe authenticated shell over existing Dose systems.

### Engineering
- production auth/passwordless flow
- `dose_customer_id` identity map
- app-owned datastore
- BFF/API layer
- Shopify adapter
- Skio adapter
- RudderStack server/client instrumentation
- Mixpanel destination validation
- warehouse export path
- feature flags
- logging/observability
- dev/staging/prod environment setup

### Product
- first-login flow
- member Home with real state
- real subscription/order reads
- routine state persistence

### Data
- canonical normalized fields
- identity-resolution QA
- event schema governance
- source reconciliation dashboards

### Exit criteria
- pilot test identity can log in
- Home renders real Shopify/Skio state
- critical events land in RudderStack, Mixpanel and warehouse
- no vendor secrets in browser
- integration failure states work

## Phase 2 — Retention utility V1

### Objective
Make the app useful enough to influence the first 90 days.

### Routine + readiness
- Taken / Later / Skip
- streak/adherence
- reminder preferences
- M1/M2/M3 check-ins
- support-need state

### Expectations + education
- config-driven Liver/Cholesterol education
- Month 1/3/6/12 milestones
- native Masterclass progression
- TAPP migration bridge

### Orders + subscription
- real order/fulfillment tracking
- next bill / next shipment
- approved skip/change-date/quantity actions
- cancellation/save-flow entry point

### Services
- concierge eligibility + booking
- clinical nutritionist eligibility + booking
- support channels

### Exit criteria
- all P0 journeys function end-to-end
- critical mutations verified against Skio
- check-in/support routing works
- content/rules can change without rewriting component logic
- accessibility and QA gates pass

## Phase 3 — Controlled pilot

### Objective
Prove reliability and estimate incremental retention impact.

### Pilot design
- defined eligible cohort
- persistent treatment/holdout assignment
- invite/activation flow
- support training
- on-call rotation
- heightened monitoring

### Measurement
- activation funnel
- routine/check-in adoption
- D24/D48/D72 tracking
- subscription mutation error rate
- support/service utilization
- qualitative feedback

### Exit criteria
- integration reliability within agreed threshold
- identity match rate acceptable
- no material state-integrity defects
- event/source reconciliation acceptable
- support burden understood
- pilot trend supports expansion or clear iteration plan

## Phase 4 — Commerce + loyalty extensions

### Objective
Expand value once core retention utility is stable.

### Capabilities
- rules-driven Discover
- add-to-next-order
- cross-sell suppression/eligibility
- commitment/annual-plan state
- rewards/milestone integration
- referral
- recipe/content library
- push lifecycle

### Exit criteria
- recommendation decisions auditable
- experiment exposure captured
- incremental revenue measurement available
- primary retention guardrails monitored

## Phase 5 — Optimization / V1.1

### Objective
Use observed behavior and retention outcomes to simplify and improve the product.

Work:
- optimize Home next-best-action priority
- improve at-risk support routing
- reduce low-value modules
- improve reminder timing
- test expectation framing
- refine service routing
- tune cross-sell eligibility
- optimize onboarding/splash
- improve performance/accessibility based on field data

## V2 — Progress + personalization

After member-state/integration foundation is proven:
- optional health-marker tracking
- lab-history visualization
- at-home testing integration
- richer loyalty
- personalized product expansion
- advanced goals dashboard
- deeper service integration
- approved AI-assisted content discovery

## V3 — Broader health ecosystem

Only if strategically/legal/operationally justified:
- automated lab imports
- provider integrations
- broader health dashboard
- wearables
- family accounts
- deeper clinical workflows

## Workstream ownership

Every phase needs named capacity for:
- Product DRI
- Engineering lead
- front-end/mobile
- backend/API
- Data/event instrumentation
- Design
- QA/release
- Analytics
- Lifecycle/Retention
- Medical/privacy/compliance
- Content/CMS
- CX/support/on-call

## Dependency map

### Auth blocks
- personalized production Home
- customer-scoped mutations
- routine persistence

### Identity/state blocks
- personalization
- experiment attribution
- cross-channel activation

### Skio integration blocks
- real plan state
- subscription self-service
- add-to-next-order if routed through Skio

### Shopify integration blocks
- order history
- fulfillment/tracking
- commerce reconciliation

### RudderStack/event governance blocks
- trustworthy Mixpanel analysis
- Klaviyo app-triggered activation
- experiment measurement

### CMS/rules blocks
- scalable product education
- auditable next-best action
- scalable recommendation logic

## Priority rule

When forced to choose between a new feature and reliability of identity/state/event pipelines, choose the foundation. A retention app with incorrect subscription state is worse than no app.