# My Dose Definition of Done

A feature is not done because the screen renders. My Dose touches subscription state, orders, lifecycle activation and potentially wellness data. Production completion requires the product, data, integration, analytics and failure behavior to be complete together.

## 1. Product
- [ ] member problem is explicit
- [ ] business outcome/KPI is explicit
- [ ] scope and non-goals are explicit
- [ ] acceptance criteria are testable
- [ ] empty/loading/error/degraded states are defined
- [ ] eligibility/suppression rules are documented
- [ ] copy/claims approved where required

## 2. Design
- [ ] follows `DOSE-DESIGN-SYSTEM.md`
- [ ] mobile-first behavior verified
- [ ] responsive edge cases verified
- [ ] focus/keyboard states designed
- [ ] accessible labels and status communication
- [ ] no broken overflow/truncation at supported widths
- [ ] design QA completed against approved source

## 3. Data
- [ ] canonical fields identified
- [ ] authoritative source identified
- [ ] null/unknown behavior defined
- [ ] freshness expectation defined
- [ ] identity behavior defined
- [ ] source-system reconciliation path exists
- [ ] no duplicate shadow source-of-truth introduced

## 4. API/integration
- [ ] client uses Dose domain contract, not raw vendor payload
- [ ] authentication/authorization enforced
- [ ] vendor credentials remain server-side
- [ ] retries/timeouts defined
- [ ] mutation is idempotent where necessary
- [ ] authoritative state re-read after critical write
- [ ] vendor failure behavior tested
- [ ] webhooks verified/idempotent where applicable

## 5. Analytics
- [ ] events documented in `EVENT-TAXONOMY.md`
- [ ] required event properties defined
- [ ] RudderStack QA passed
- [ ] Mixpanel destination validated
- [ ] warehouse path validated for business-critical event
- [ ] no duplicate event firing
- [ ] experiment assignment/exposure captured if applicable
- [ ] owner/dashboard identified

## 6. Lifecycle activation
If Klaviyo/SMS behavior depends on the feature:
- [ ] event/property mapping documented
- [ ] consent behavior verified
- [ ] suppression rules verified
- [ ] test profile validated end-to-end
- [ ] app + lifecycle experiences do not contradict each other

## 7. Security/privacy
- [ ] threat/abuse considerations reviewed
- [ ] least privilege used
- [ ] PII logging reviewed
- [ ] sensitive inputs classified
- [ ] consent implemented if required
- [ ] retention/deletion implications documented
- [ ] medical boundary reviewed if health-related

## 8. Testing
- [ ] unit tests for business logic
- [ ] contract tests for adapters
- [ ] integration tests for critical path
- [ ] E2E happy path
- [ ] E2E failure path
- [ ] mobile/browser matrix spot check
- [ ] accessibility checks
- [ ] regression on adjacent critical flows

## 9. Operations
- [ ] logs/metrics exist
- [ ] alert or monitoring coverage exists for critical failure
- [ ] feature flag/kill switch exists when risk warrants it
- [ ] rollback path documented
- [ ] CX support behavior/macros updated if needed
- [ ] runbook/docs updated

## 10. Release
- [ ] staging validation complete
- [ ] pilot/rollout cohort defined
- [ ] guardrail metrics defined
- [ ] no unresolved P0/P1 defects
- [ ] known limitations documented
- [ ] production owner/on-call aware

## 11. Critical-state rule

For subscription/order/payment/identity features, **UI success is not proof of completion**. The authoritative source must confirm the new state.

## 12. Documentation rule

Any change that alters member behavior, canonical state, API contracts, events, rules, security boundaries or rollout process must update the relevant repository documentation in the same PR.

## 13. Final test

Ask:

> If the original engineer, PM or analyst disappeared tomorrow, could another cross-functional Dose teammate understand what this feature does, what data it uses, how it is measured, how it can fail, and how to turn it off?

If not, it is not done.