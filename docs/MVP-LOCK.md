# My Dose MVP Lock — Phase 0

## Decision

Stop broad feature expansion temporarily and convert the current prototype into one coherent, pilotable member experience.

The MVP is not the full product vision. It is the smallest version of My Dose that can reliably answer:

**What is the most useful thing for this member to do today?**

and allow Dose to test whether a persistent member experience improves first-90-day readiness, adherence, support usage, subscription survival and LTV.

## MVP product spine

The first 90 days remain the organizing structure:

- Day 0 — activation, routine setup, expectations
- Day 24 — rebill/order readiness
- Day 48 — progress, support and fit
- Day 72 — milestone and habit reinforcement
- Day 90 — reflection and next journey

## Canonical MVP navigation

Primary navigation:

1. **Today** — one primary next action plus the most relevant supporting modules
2. **Journey** — 90-day history, milestones, check-ins and progress
3. **Learn** — product education and Masterclass progression
4. **Orders** — order/tracking and subscription utility
5. **You** — profile, services, rewards, support and preferences

### Secondary destinations

These should not compete for permanent bottom-navigation space:

- Rewards
- Wellness profile/check-ins
- Challenges
- Circle
- Discover / cross-sell
- Connected routine / integrations
- 90-day report
- Subscription management

They should be reached contextually from Today, Journey, Orders or You.

## MVP P0

### Identity + shell
- passwordless/member authentication
- canonical `dose_customer_id`
- returning-member state
- demo state separated from production member state

### Today
- one primary next-best action
- Taken / Later / Skip
- persisted daily routine state
- relevant expectation milestone
- next order / next bill visibility
- support CTA when needed
- current education step

### Journey
- lifecycle day/month
- Month 1 / 3 / 6 / 12 expectations
- 90-day routine history
- M1/M2/M3 check-in history
- education milestones
- order milestones

### Learn
- product-specific intro
- usage guidance
- Masterclass progression
- expectation education

### Orders + subscription
- Shopify order read
- fulfillment/tracking read
- Skio subscription read
- approved skip/change-date/quantity actions
- cancellation/save-flow entry point

### Services
- concierge
- clinical nutritionist
- support channels

### Data + measurement
- RudderStack instrumentation
- Mixpanel validation
- warehouse event path
- experiment assignment / holdout persistence

## Pilot-later / P1

Keep in the product vision but do not block the first authenticated pilot:

- rewards and milestone gifts
- challenges
- Dose Circle
- referrals
- Discover / cross-sell optimization
- recipe/content library expansion
- 90-day wellness report
- richer wellness journal
- connected calendar
- push lifecycle

## Vision / native-dependent

Prototype and research, but do not make these a web-pilot dependency:

- Apple Health
- Apple Watch
- Siri / Shortcuts
- lock-screen and home-screen widgets
- actionable native notifications
- broader wearable ecosystem

## Explicit non-goals for the pilot

- custom payment processor
- custom subscription engine
- custom loyalty ledger
- public social network
- full ecommerce storefront
- autonomous health diagnosis
- clinical interpretation of wearable or self-reported data
- microservices architecture

## Phase 0 exit criteria

Before feature development resumes broadly:

- canonical IA accepted
- Home priority rules accepted
- one design-token system accepted
- normalized member-state interface defined
- demo vs production state separated
- P0/P1/vision scope tagged
- pilot experiment skeleton documented
- backlog created for foundation work

## Priority rule

When forced to choose between a new feature and reliable identity, subscription state, order state, event delivery or measurement, choose the foundation.
