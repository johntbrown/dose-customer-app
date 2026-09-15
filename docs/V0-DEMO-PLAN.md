# Dose Customer App — V0 Demo Plan

_Last updated: September 15, 2026_

## Decision

Build V0 as a mobile-first web app / PWA that demonstrates the Dose member experience without making production integrations a prerequisite.

The immediate objective is to create a credible app experience that can be opened on a phone and demonstrated to Dose leadership. Shopify, Skio, RudderStack, Klaviyo, TAPP, loyalty, and other integrations can be connected incrementally after the experience is validated.

## V0 Objective

Prove that a persistent Dose member home can make the subscription experience more useful, engaging, and retention-oriented.

V0 should answer:

1. Does the experience feel valuable enough to revisit?
2. Can we represent different lifecycle/customer states clearly?
3. Which features should graduate into a production V1?
4. What integrations are actually necessary after we validate the experience?

## Hosting / Environments

Preferred demo host: Vercel.

Planned workflow:

- Local: active development
- Preview: QA of individual changes
- Demo: stable leadership/team demo
- Production Pilot: controlled customer experiment later

Target architecture: GitHub -> Vercel -> mobile-first web app/PWA.

## V0 Scope

### Home / Today
- Personalized greeting
- Current journey/month state
- Today's Dose habit check-in
- Streak/progress visualization
- Recommended next action

### Progress
- M1 / M2 / M3 journey
- Expected progress and education
- Check-ins

### Learn
- TAPP-style education/content
- Contextual content recommendations

### My Plan
- Subscription/order summary
- Next order information
- Demo subscription actions
- Links/deep links to existing systems where appropriate

### Support
- Health Concierge entry point
- Help/support entry point

### Rewards
- Loyalty/rewards concept
- Progress toward benefits
- Demo redemption experience

## Demo Customer States

V0 will support multiple simulated customer profiles so stakeholders can see how the experience changes by lifecycle state.

Initial profiles:

1. Month 1 active subscriber — early habit-building and onboarding
2. Month 2 at-risk subscriber — lower engagement and intervention-oriented experience
3. Month 4 engaged subscriber — progress, loyalty, education, and expansion experience

No real customer PII is required for V0.

## Integration Principle

Do not let missing write APIs block V0.

Where an integration exists, we can use it. Where it does not, V0 should simulate the intended experience or hand the user into the existing system.

Examples:

- Skip/change shipment: simulated in V0 or deep link to Skio
- Add product: simulated or link to Shopify PDP
- Loyalty redemption: simulated
- Health Concierge: existing link/form
- Subscription management: read-only/demo UI or Skio handoff

The UI/data layer should be structured so mocked data can later be replaced with production services without redesigning the experience.

## Production Test Strategy

After V0 validation, V1 should be tested as a controlled retention experiment rather than a universal launch.

Example design:

- Control: existing Dose experience
- Treatment: existing Dose experience + My Dose web app access

Potential initial audience: 1,000–3,000 eligible active subscribers, subject to power analysis and available cohort size.

### Funnel

Invite -> App Visit -> Login/Recognition -> Activation -> Habit Action -> Repeat Visit -> M2/M3 Engagement -> Retention

### Early Success Metrics

- Invite-to-activation rate
- First check-in completion
- 7-day return rate
- 30-day active rate
- Content/module engagement
- Health Concierge engagement
- Subscription-management intent

### Business Outcome

Compare M2/M3 retention and other downstream behaviors between treatment and control. A later test should specifically evaluate whether the app changes behavior among customers identified as likely to churn.

## Roadmap

### V0 — Demo

Mobile-first PWA with realistic mocked customer states and interactive experiences. No production integration dependency.

### V1 — Production Pilot

Real authentication/customer recognition, analytics, content, habits/progress, and safe handoffs to existing transactional systems.

### V1.5 — Connected App

Native subscription management, loyalty, product changes, personalization, and additional integrations.

### V2 — Retention Engine

Customer state and behavioral data determine personalized next-best actions and interventions.

## Immediate Build Priorities

1. Establish web/PWA application foundation.
2. Build mobile navigation and design system.
3. Implement demo customer-state selector.
4. Build Home / Today experience.
5. Build Progress and habit interactions.
6. Build My Plan/subscription demo.
7. Build Learn, Rewards, and Support surfaces.
8. Add event instrumentation abstraction.
9. Configure Vercel preview/demo deployment.
10. QA on mobile and prepare leadership demo.

## Documentation Standard

Product decisions, architecture decisions, implementation notes, known limitations, and material scope changes should be documented in this repository alongside the code so the repository remains the source of truth for the app build.