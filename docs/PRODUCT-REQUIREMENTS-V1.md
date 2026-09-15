# My Dose V1 Product Requirements

## 1. Purpose

My Dose turns Dose's fragmented post-purchase experience into one persistent member product. It should help subscribers build a daily routine, understand when results may appear, manage orders/subscriptions, access support and services, and receive one relevant next action without needing to navigate across email, TAPP, Shopify account pages, Skio and support tools.

## 2. Product thesis

The retention problem is not one cancellation problem. It is a customer-readiness and subscription-fit problem. The app should reduce that gap by making product use, expectation setting, support and subscription control visible throughout the first 90 days and beyond.

## 3. Target audience

### Primary
Active DTC subscribers.

### Secondary
- recently lapsed subscribers where a limited reactivation experience is strategically useful
- OTP buyers when a conversion or education handoff is appropriate

### V1 exclusion
Do not design V1 as a general public shopping app. Non-members should receive a clear web handoff or limited conversion path.

## 4. North-star experience

On every visit, answer:

**What is the most useful thing for this member to do today?**

The answer can be:
- take/log today's Dose
- complete a monthly check-in
- review expectations
- view/track the next order
- update subscription
- book concierge/nutritionist
- continue education
- claim a reward
- explore a relevant complementary product

Only one primary next action should dominate Home.

## 5. V1 goals

### Member goals
- understand how to take the product
- understand what to expect and when
- build a repeatable daily habit
- avoid running out / overstocking
- know where the next order is
- change subscription without friction
- get human help when uncertain
- discover member benefits
- understand other products only when relevant

### Business goals
- improve D24/D48/D72 subscription survival
- improve early customer readiness and confidence
- reduce avoidable first-order/early-cycle cancels
- improve rebill protection and payment/order readiness
- increase use of support services where they improve fit
- increase qualified cross-sell/upsell
- create persistent zero-party and behavioral state usable by lifecycle channels
- enable controlled experimentation with holdouts

## 6. Core journeys

### Journey A — First login / activation
**Trigger:** authenticated customer enters app for first time.

Flow:
1. resolve customer identity
2. identify active product(s), subscriber status, lifecycle day/cycle
3. show short My Dose orientation
4. confirm routine/serving goal
5. optionally set reminders
6. surface product-specific expectations
7. land on personalized Home

Acceptance criteria:
- returning users do not repeat splash unless reset by an approved product rule
- first-login completion persists
- customer product/subscription is recognized without asking for redundant information
- consent is explicit before optional health-marker/sensitive-wellness data is collected

### Journey B — Daily routine
Actions:
- Taken
- Later
- Skip / did not take

Requirements:
- event emitted for every action
- daily state persists across devices/sessions
- streak/adherence logic is deterministic and documented
- missed days do not punish the customer with shaming copy
- reminder timing can be member-controlled

### Journey C — Expectations / progress
The experience should align to retention windows:
- Month 1: build routine / ingredients becoming part of routine
- Month 3: meaningful result checkpoint and clinical-proof framing
- Month 6: bloodwork/progress checkpoint where appropriate
- Month 12: long-term routine / next journey

Requirements:
- product-specific approved copy
- milestone state based on lifecycle/customer state, not hard-coded UI
- claims include required disclaimers
- no diagnosis or autonomous interpretation

### Journey D — M1/M2/M3 check-ins
Purpose: confidence, support need, routine fit and progress signal.

Inputs can include:
- confidence in routine
- product usage questions
- perceived progress
- support need
- bloodwork interest
- content/service preference

Outputs:
- normalized profile properties
- `dose_needs_support` or equivalent state when needed
- next-best action
- CX/concierge follow-up path where appropriate

### Journey E — Subscription / order control
Member should see:
- current product
- quantity / cadence
- next bill/ship date
- next order
- tracking
- approved Skio controls

V1 mutations:
- skip next shipment
- change next date
- quantity change where approved
- product/add-on change where approved
- cancellation/save-flow entry point

Every write must:
1. authenticate/authorize member
2. validate eligibility
3. mutate authoritative source
4. re-read source state
5. only then confirm success to member
6. emit structured event

### Journey F — Support and services
Surfaces:
- health concierge
- clinical nutritionist
- FAQs/help
- chat/phone/email
- community handoff

Support logic should be shared structurally across products. Product context personalizes content, but the operational outcome is one support path.

### Journey G — Education
V1 starts with a config-driven native program replacing TAPP presentation over time.

Minimum:
- product intro
- usage
- Month 1 expectation setting
- progress/measurement education
- Masterclass sequence
- completion state

Do not clone the entire app for Liver vs Cholesterol vs future products. Use shared templates + data/config.

### Journey H — Discovery / cross-sell
Cross-sell eligibility is based on current ownership and state, not the flow a customer came from.

Initial rules:
- Liver owned + no Cholesterol → Cholesterol candidate
- Cholesterol owned + no Liver → Liver candidate
- bundle/owns both → suppress those complementary cross-sells
- future products → prioritized next-best-product rules

Creative execution can vary independently from eligibility logic.

### Journey I — Rewards / milestones
P1 unless necessary for pilot.

Display:
- available benefit/gift
- milestone progress
- reward status
- referral status

Do not build custom points/ledger logic if an existing loyalty system can own it.

## 7. Home requirements

Home should aggregate:
- greeting / lifecycle context
- one primary action
- routine state
- expectation milestone
- current education
- next shipment/order
- support prompt when eligible
- benefit/reward when eligible
- one recommendation slot when eligible

Rules:
- no more than one primary CTA
- suppress irrelevant modules
- prioritize risk/support/order issues over merchandising
- do not show recommendation if customer has unresolved fulfillment/subscription/support friction that should take priority

## 8. Personalization model

V1 uses deterministic rules based on normalized state.

Inputs:
- product ownership
- bundle status
- serving size where needed
- lifecycle/cycle/day
- active subscription state
- next order/bill
- routine adherence
- check-in state
- support need
- services used
- content completed
- loyalty state
- commitment status
- goals/ZPD
- experiment assignment

Outputs:
- next-best action
- current milestone
- education track
- support/service CTA
- recommendation slot/target
- suppression rules

All recommendation decisions must be explainable/auditable.

## 9. Data requirements

Canonical identity: `dose_customer_id`.

Do not key business logic solely on email.

System-of-record ownership:
- Shopify: customer/order/commerce
- Skio: subscription
- RudderStack/CDP/normalized state: app-ready state/event routing
- Warehouse/BI: official history/business metrics
- Klaviyo: activation
- TAPP: interim ZPD/check-ins until migration

See `DATA-CONTRACTS.md`.

## 10. Analytics requirements

Every meaningful behavior emits a structured event. Minimum categories:
- app/session
- routine
- check-ins
- education/content
- subscription
- order tracking
- support/services
- recommendations/commerce
- rewards/referral
- profile/preferences
- experiments

Success measurement prioritizes retention and LTV, with feature adoption as explanatory metrics.

See `EVENT-TAXONOMY.md` and `EXPERIMENTATION-AND-MEASUREMENT.md`.

## 11. UX requirements

Canonical visual source: `DOSE-DESIGN-SYSTEM.md`.

Requirements:
- mobile first
- Dose cream/green/beige system
- display serif + grounded sans
- pill CTAs
- rounded surfaces
- sentence-case buttons
- generous section whitespace
- one strong accent color per screen
- accessible contrast/touch targets
- calm motion
- no startup-SaaS dashboard aesthetic

## 12. Performance / reliability requirements

Target production expectations:
- initial authenticated Home payload designed for fast aggregate response
- non-critical modules degrade independently
- no client-side vendor secrets
- mutation idempotency
- retry strategy for safe reads/event delivery
- loading, empty, partial and error states for every integrated module
- observability around identity failures, vendor API failures and event-delivery failures

## 13. Accessibility

Minimum V1:
- keyboard operability for web/PWA
- semantic landmarks/headings
- visible focus
- accessible labels
- 44px-equivalent tap targets where practical
- screen-reader announcements for mutation success/failure
- no color-only state indicators
- reduced-motion support

## 14. Privacy / medical boundaries

- explicit consent for optional health-marker or sensitive wellness inputs
- no autonomous diagnosis
- no medical advice beyond approved education/provider-referral scope
- data minimization
- deletion/export path
- least privilege
- audit logs for sensitive/admin actions

## 15. Pilot acceptance criteria

Before customer pilot:
- auth/account matching works for defined pilot cohort
- Shopify read integration validated
- Skio read integration validated
- approved Skio mutations tested and reversible/recoverable
- core RudderStack events validated end-to-end
- Mixpanel funnels available
- identity match rate and failure handling measured
- no P0 accessibility blockers
- no known P0/P1 security issues
- privacy/medical review complete for included data
- support escalation path documented
- feature flags and kill switches available
- rollback plan tested
- pilot/holdout cohort assignment persisted

## 16. V1 launch criteria

Broader launch requires:
- pilot reliability within agreed thresholds
- analytics reconciliation against source systems
- event/data QA passed
- material subscription/order errors below agreed threshold
- demonstrated support readiness
- experiment design approved
- production runbook/on-call ownership established

## 17. V2 / V3 extensions

### V2
- richer progress + personalization
- optional health-marker tracking
- lab-history visualization
- at-home testing integration
- richer loyalty
- deeper service integration
- personalized product expansion
- approved AI-assisted content discovery

### V3
- automated lab imports
- provider integrations
- broader health dashboard
- wearables
- family accounts
- deeper clinical-service workflows if strategically and legally appropriate

## 18. Product principle

The app should make the existing Dose ecosystem feel like **one coherent relationship**. If a feature does not make the member more ready, more confident, better supported, or better matched to their subscription, it should not automatically enter V1.