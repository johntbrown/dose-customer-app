# My Dose QA, Release & Incident Runbook

## Purpose

Define how My Dose moves from prototype to controlled pilot to production without putting subscription/order state or customer trust at risk.

## 1. Environments

### Local
- developer machine
- mock/synthetic data by default
- no production credentials

### Preview
- automatically generated per PR/branch
- UI review and isolated feature QA
- test/sandbox integrations only

### Staging
- production-like configuration
- integration QA
- synthetic/approved internal test identities
- full event pipeline into staging destinations

### Demo
- stable leadership/stakeholder URL
- may use deterministic mock customer states
- never confused with production pilot

### Production Pilot
- restricted real-customer cohort
- feature flags + holdout assignment
- production integrations
- heightened monitoring

### Production
- wider availability only after pilot exit criteria

## 2. Branch/release model

Recommended:
- `main` always deployable
- short-lived feature branches
- PR required for production code
- preview deployment per PR
- staging promotion from approved commit
- production release from tagged/identified commit

The current open product-foundation branch must be reconciled with the evolved main prototype before production engineering proceeds, to avoid maintaining two competing architectures.

## 3. Pull-request requirements

PR should include:
- problem/outcome
- screenshots or recording for UI change
- data/API changes
- events added/changed
- privacy/security impact
- failure/empty/loading states
- test coverage
- feature flag / rollout plan
- docs updated

## 4. Automated checks

Before merge:
- install/build
- lint
- typecheck when TypeScript is adopted
- unit tests
- component tests where appropriate
- API/contract tests
- accessibility smoke checks
- dependency vulnerability scan
- formatting

Before pilot:
- end-to-end critical paths
- integration contract tests
- event-pipeline validation
- performance smoke test

## 5. Critical-path E2E tests

### Auth
- first login success
- returning login
- expired link/OTP
- ambiguous identity
- no matching customer
- logout/session expiry

### Home
- active subscriber
- at-risk member
- subscription/order issue
- support need
- recommendation suppression

### Routine
- taken
- later
- skip
- edit same-day state
- streak/adherence update

### Check-ins
- start/resume
- partial answers
- completion
- support need detected

### Subscription
- read current state
- skip eligible shipment
- mutation rejected
- upstream timeout
- idempotent retry
- authoritative state re-read

### Orders
- no order
- processing
- in transit
- delivered
- exception
- stale tracking

### Education
- program eligibility
- completion persistence
- next module
- migrated TAPP state where supported

### Recommendations
- eligible
- already owns product
- support suppression
- holdout suppression
- add-on success/failure

## 6. Browser/device matrix

For PWA/web V1 at minimum:
- iOS Safari current + previous major
- Android Chrome current
- desktop Chrome current
- desktop Safari current

Validate:
- safe-area bottom nav
- text scaling
- touch targets
- sticky elements
- modals/drawers
- keyboard inputs
- installed-PWA behavior if supported

## 7. Accessibility QA

- semantic heading order
- keyboard navigation
- focus visibility
- accessible names
- form errors announced
- no color-only status
- contrast
- reduced motion
- 200% zoom/reflow
- screen-reader spot checks on core flows

## 8. Data/event QA

For each release:
- events visible in RudderStack
- event counts not duplicated
- authenticated identity attached after login
- Mixpanel properties typed correctly
- Klaviyo events/properties arrive only where intended
- warehouse ingestion verified for critical events
- experiment variant/exposure correct

For critical mutations reconcile app events to Skio/Shopify source state.

## 9. Integration failure behavior

### Shopify unavailable
- retain non-commerce app functions
- show order/subscription-adjacent degraded state rather than false data

### Skio unavailable
- disable write controls
- do not imply change completed
- show retry/support path

### Content/CMS unavailable
- use last approved cache/generic fallback
- operational modules remain available

### RudderStack unavailable
- app utility should continue where safe
- queue/retry according to event implementation
- monitor dropped-event risk

### Recommendation service unavailable
- suppress recommendation slot
- do not block Home

## 10. Feature flags / kill switches

Required flags for production-risk domains:
- subscription mutations
- recommendation/add-to-next-order
- push/reminders
- check-ins
- services booking
- rewards
- new content/rules versions

A kill switch must remove the risky function without requiring emergency code deployment.

## 11. Pilot readiness checklist

- [ ] pilot cohort/holdout defined
- [ ] auth match rate tested
- [ ] customer-state fields validated
- [ ] Shopify integration QA complete
- [ ] Skio reads complete
- [ ] approved Skio writes complete
- [ ] event contract validated
- [ ] Mixpanel dashboards ready
- [ ] warehouse reconciliation queries ready
- [ ] support/CX training complete
- [ ] privacy/medical review complete
- [ ] alerts configured
- [ ] on-call owner assigned
- [ ] rollback tested
- [ ] known issues documented

## 12. Release procedure

1. merge approved PR
2. deploy staging
3. run smoke/E2E checks
4. validate events
5. validate vendor integrations
6. approve release commit
7. deploy behind flag
8. internal smoke
9. enable pilot percentage/cohort
10. monitor errors/latency/events/mutations
11. expand only after agreed observation window

## 13. Rollback

Rollback priority:
1. disable feature flag / mutation path
2. revert config/rule version
3. revert deployment
4. vendor-level disable if required

Never attempt to "roll back" already-completed subscription changes by guessing. Reconcile with authoritative system and handle correction explicitly.

## 14. Monitoring

Core engineering dashboards:
- app error rate
- API latency p50/p95/p99
- auth failure rate
- identity resolution failure
- Shopify adapter errors
- Skio adapter errors
- subscription mutation success/failure
- order/tracking failures
- webhook lag/failure
- RudderStack delivery health
- recommendation errors

Business health during pilot:
- activation
- routine adoption
- check-in completion
- support/service use
- D24/D48/D72
- cancellation/contact/refund guardrails

## 15. Incident severity

### SEV1
Customer state/financial/subscription integrity risk, broad auth failure, sensitive data exposure.

Action: disable impacted feature immediately, page owners, begin incident process.

### SEV2
Major feature unavailable or high error rate with workaround.

### SEV3
Localized defect/cosmetic issue without state integrity risk.

## 16. Incident record

Capture:
- start/end
- detection source
- affected cohort
- customer impact
- systems involved
- mitigation
- root cause
- data/state reconciliation needed
- follow-up owners
- prevention actions

## 17. Production definition

A release is not complete at deploy time. It is complete when monitoring is healthy, analytics are verified, and customer/source-system state is reconciled for the features changed.