# Contributing to My Dose

My Dose touches customer identity, orders, subscription state, lifecycle activation, retention measurement and potentially wellness-related inputs. Contributions should optimize for **state integrity, explainability and measurable customer value**, not just UI velocity.

## 1. Before coding

Read:
- `README.md`
- `docs/PROJECT-INDEX.md`
- `docs/PRODUCT-REQUIREMENTS-V1.md`
- `docs/DEFINITION-OF-DONE.md`

Then read the relevant domain contract:
- data → `DATA-CONTRACTS.md`
- API/integration → `API-CONTRACTS.md`
- events → `EVENT-TAXONOMY.md`
- content/rules → `CONTENT-AND-RULES.md`
- privacy/medical → `SECURITY-PRIVACY-MEDICAL.md`
- release → `QA-RELEASE-RUNBOOK.md`

## 2. Product rule

Every feature must answer:
1. What member problem does this solve?
2. What business outcome should improve?
3. What customer state makes it eligible?
4. What happens when data/integration fails?
5. How will we measure it?

If those are unclear, define them before implementation.

## 3. Architecture rules

- My Dose is an experience/orchestration layer.
- Shopify remains commerce/order truth.
- Skio remains subscription truth.
- Vendor payload shapes do not belong in UI components.
- Client code talks to Dose-owned domain contracts/BFF.
- App-owned DB stores app-specific state only.
- Use a modular monolith for V1.
- Do not add a microservice without a documented scaling/security/ownership reason.
- Use normalized state, not repeated raw SKU/vendor-property logic.

## 4. State and mutations

For customer-critical mutations:
- authenticate
- authorize resource ownership
- validate eligibility
- use idempotency when retries could duplicate action
- mutate authoritative system
- re-read authoritative state
- return success only after verification
- emit terminal event
- retain request/correlation ID for support

Never show success optimistically for a subscription mutation.

## 5. Data rules

- `dose_customer_id` is the canonical member identifier.
- Do not key durable business logic only on email.
- Events = what happened.
- Properties = current state/eligibility.
- Define null/unknown behavior explicitly.
- Include freshness metadata where stale state could mislead the customer.
- Reconcile critical analytics to authoritative systems.

## 6. Analytics rules

Do not ship meaningful behavior without instrumentation.

Every event needs:
- stable name
- trigger
- required properties/types
- schema version
- identity behavior
- destination/use case
- PII/sensitive-data review

Official retention/revenue/subscriber metrics come from governed business data, not Mixpanel alone.

## 7. UX/design rules

`docs/DOSE-DESIGN-SYSTEM.md` is canonical.

Do not introduce new brand tokens casually.

General principles:
- cream / deep green / beige / black
- display serif only for headings/display
- grounded sans for body/UI
- rounded/pill shapes
- sentence-case CTAs
- one dominant primary action
- calm spacing/motion
- no SaaS-dashboard aesthetic
- accessible touch targets/focus/states

## 8. Privacy/security rules

Never commit:
- secrets
- real customer PII
- personal emails in sample URLs
- private tracking params
- production tokens
- sensitive internal datasets

Use synthetic test data in this public repository.

New health/wellness fields require purpose, classification, consent and review.

## 9. Branching

Preferred:
- short-lived feature branches
- PR into `main`
- keep `main` deployable

Avoid long-lived parallel architectures. If work requires major architecture change, write an ADR and migration plan.

## 10. Commit/PR quality

Commit messages should describe the outcome, e.g.:
- `Add canonical customer state contract`
- `Verify Skio skip mutation before success`
- `Add M2 check-in support routing`

PRs should be reviewable units, not unrelated bundles.

Use `.github/pull_request_template.md`.

## 11. Tests

Prefer tests at the correct boundary:
- pure business rules → unit tests
- vendor adapters → fixture/contract tests
- BFF routes → integration tests
- critical member flows → E2E
- visual/layout → responsive/design QA

Critical error states deserve tests, not only happy paths.

## 12. Documentation

Update docs in the same PR when changing:
- product behavior
- canonical state
- API contracts
- event contracts
- business rules
- security/privacy boundaries
- release behavior
- architecture decisions

## 13. Source-of-truth conflict

If the app disagrees with Shopify or Skio, do not patch the display by guessing. Diagnose the source/normalization path.

State integrity defects take priority over visual defects.

## 14. Completion

Before marking work complete, review `docs/DEFINITION-OF-DONE.md`.