# My Dose Operating Model

## Purpose

My Dose crosses Product, Engineering, Data, Retention, Design, Analytics, CX, content and privacy/medical review. The project will fail through ambiguity faster than through lack of ideas. This document defines decision rights, owners and working cadence.

## 1. Core decision rights

### Product DRI
Owns:
- V1 scope
- prioritization
- member jobs / UX outcome
- feature acceptance
- roadmap tradeoffs

### Engineering lead
Owns:
- technical architecture
- implementation choices
- reliability/performance
- security implementation
- release engineering
- technical debt decisions

### Data / analytics lead
Owns:
- canonical identity/state definitions with Product/Engineering
- event schema governance
- source reconciliation
- experiment measurement
- official business metrics

### Retention / Lifecycle
Owns business requirements for:
- first 90-day journey
- expectation setting
- rebill protection
- support/right-size moments
- cross-sell/commitment/loyalty use cases
- Klaviyo activation requirements

### Product Design
Owns:
- app interaction design
- design-system adherence
- accessibility/design QA
- flows/prototypes

### CX / support
Owns:
- escalation path
- customer-facing support operations
- support macros/training
- feedback loop on recurring product friction

### Medical/privacy/compliance
Owns approval boundaries for:
- claims-bearing content
- sensitive wellness/health-marker data
- provider/referral language
- privacy/consent requirements

## 2. Suggested RACI by domain

| Domain | Accountable | Responsible partners |
| --- | --- | --- |
| V1 scope | Product | Retention, Eng, Design |
| Client architecture | Engineering | Product, Design |
| Identity | Data/Eng | Product, Lifecycle |
| Subscription integration | Engineering | Product, Retention, CX |
| Event taxonomy | Data/Analytics | Eng, Product, Lifecycle |
| Education content | Product/Content | Retention, Medical, Design |
| Next-best-action rules | Product/Retention | Data, Eng |
| Cross-sell rules | Retention/Product | Analytics, Eng |
| Experiment design | Analytics/Product | Retention, Data |
| Privacy | Privacy/Legal | Product, Eng, Data |
| Release readiness | Eng/QA | Product, CX, Analytics |
| Support readiness | CX | Product, Eng |

## 3. Project cadence

### Weekly product/engineering decision meeting
Agenda:
1. business outcome / KPI movement
2. blockers / architecture decisions
3. user-flow/design decisions
4. data/event decisions
5. risk/privacy issues
6. next sprint commitments

### Two-week sprint
- planning: scoped acceptance criteria + dependencies
- mid-sprint integration check
- end-sprint demo with real states/failure states, not only happy-path screenshots
- retro focused on delivery/system quality

### Weekly data QA
Review:
- identity match quality
- event anomalies
- source reconciliation
- experiment assignment/exposure
- integration freshness

### Pilot daily/near-daily health review
During controlled launch:
- auth failures
- adapter errors
- mutation failures
- event pipeline
- CX tickets
- guardrail metrics

## 4. Decision log

Material decisions should be written as ADRs or in a decision log with:
- date
- decision
- owner
- alternatives
- rationale
- consequences
- revisit trigger

Examples:
- PWA vs React Native
- auth provider
- app datastore
- CMS/rules tooling
- push provider
- tracking provider
- loyalty integration

## 5. Product backlog hierarchy

### Initiative
Business outcome, e.g. `Improve first-90-day subscriber readiness`.

### Epic
Large coherent capability, e.g. `Canonical identity and customer state`.

### Story
User/business behavior, e.g. `Member can skip next eligible shipment`.

### Task
Implementation unit.

Each story should identify:
- member problem
- business outcome
- acceptance criteria
- source data
- events
- error states
- rollout flag
- privacy/security implications

## 6. Architecture governance

Engineering can choose implementation patterns, but these boundaries are non-negotiable without explicit product/data review:
- Shopify owns commerce/orders
- Skio owns subscription state
- warehouse owns official historical business metrics
- RudderStack/event layer routes behavior
- app does not create shadow subscription/payment systems
- canonical identity is required
- business rules must be explainable/auditable

## 7. Content governance

Claims-bearing content has an owner and approval status.

Required workflow:
- draft
- product/content review
- medical/legal review if applicable
- publish
- version history

Avoid editing clinically meaningful claims directly in source code without a governed content path.

## 8. CX feedback loop

Create tagged feedback categories:
- auth/account-linking
- order/tracking
- subscription controls
- routine/reminders
- results expectations
- product-use questions
- check-in/support
- recommendation relevance
- rewards/referral

Weekly product review should quantify top friction rather than rely only on anecdotes.

## 9. Data issue escalation

Examples requiring rapid review:
- app and Skio disagree on subscription state
- app shows owned product as cross-sell
- identity maps customer to wrong order
- critical event volume drops/spikes
- Mixpanel and warehouse cohorts materially diverge

State-integrity issues outrank cosmetic backlog.

## 10. Repository ownership

Dose owns:
- source code
- schemas/contracts
- documentation
- configuration/rules definitions
- deployment assets
- infrastructure-as-code where added
- analytics specifications

Avoid critical business logic living only in a vendor UI without documented representation in this repository.

## 11. Definition of a good executive update

Lead with:
- outcome / risk
- what changed
- evidence
- decision needed
- next step

Avoid updates that are only lists of engineering activity.

## 12. Pre-build alignment checklist

- [ ] Product DRI assigned
- [ ] Engineering lead assigned
- [ ] backend/front-end capacity committed
- [ ] Data/Analytics owner assigned
- [ ] Design owner assigned
- [ ] QA/release owner assigned
- [ ] Lifecycle/Retention requirements owner assigned
- [ ] CX/support owner assigned
- [ ] Medical/privacy owner assigned
- [ ] Content/CMS owner assigned
- [ ] on-call ownership defined
- [ ] V1 audience + exclusions confirmed
- [ ] identity/source-of-truth decision confirmed
- [ ] pilot cohort/measurement owner confirmed

## 13. Guiding principle

The app is a cross-functional operating system for the member relationship. No team should need to reverse-engineer another team's hidden logic to understand what a customer sees or why.