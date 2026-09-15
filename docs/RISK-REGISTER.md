# My Dose Risk Register

_Last updated: September 15, 2026_

## Purpose

Track risks that could materially hurt customer trust, retention measurement, engineering velocity, or launch readiness. This is not a generic project checklist. It is specific to a member app that orchestrates subscription, order, lifecycle and wellness experiences across multiple systems.

## Rating

- **Impact:** Low / Medium / High / Critical
- **Likelihood:** Low / Medium / High
- **Owner:** role, until a named DRI is assigned

## 1. Dual architecture / branch drift

**Risk:** `main` and the product-foundation branch evolve independently, creating duplicate app shells, styling systems and service abstractions.

- Impact: High
- Likelihood: High
- Owner: Engineering lead + Product
- Mitigation: issue #6; reconcile before major production integration work.
- Trigger: same capability implemented differently in two branches.

## 2. Incorrect customer identity resolution

**Risk:** A member is mapped to the wrong Shopify customer, Skio subscription or order.

- Impact: Critical
- Likelihood: Medium
- Owner: Engineering + Data
- Mitigation: canonical `dose_customer_id`, server-side ownership checks, ambiguous-match state, synthetic QA, audit logs.
- Kill condition: any cross-customer data exposure blocks pilot expansion.

## 3. App displays stale/wrong subscription state

**Risk:** Customer sees wrong next bill, cadence, quantity, or status.

- Impact: Critical
- Likelihood: Medium
- Owner: Engineering
- Mitigation: Skio source-of-truth, freshness metadata, read-through/re-read after mutations, no cache after writes.

## 4. Subscription mutation says success before Skio confirms

**Risk:** UI claims a skip/date/quantity change occurred when authoritative state did not change.

- Impact: Critical
- Likelihood: Medium
- Owner: Engineering
- Mitigation: idempotency, read-after-write verification, explicit indeterminate states, issues #2–#5.

## 5. Event/identity inflation or reconciliation failure

**Risk:** Browser/device events are mistaken for unique customers or event counts cannot reconcile to source systems.

- Impact: High
- Likelihood: Medium
- Owner: Data/Analytics
- Mitigation: canonical authenticated ID, source reconciliation, `EVENT-TAXONOMY.md`, issue #9.

## 6. Self-selection bias makes app look more effective than it is

**Risk:** More engaged customers adopt the app, producing misleading retention comparisons.

- Impact: High
- Likelihood: High
- Owner: Analytics/Product
- Mitigation: randomized holdout where practical, persistent assignments, pre-registered analysis, issue #15.

## 7. Over-personalization from fragile raw properties

**Risk:** App duplicates existing lifecycle complexity by repeatedly checking raw SKUs/subscription fields.

- Impact: High
- Likelihood: Medium
- Owner: Data/Product/Engineering
- Mitigation: normalized upstream state; ADR 0003; one canonical field per business question.

## 8. Commercial recommendation shown during customer friction

**Risk:** Cross-sell appears while customer has payment, fulfillment, subscription or support problems.

- Impact: High
- Likelihood: Medium
- Owner: Product/Retention
- Mitigation: NBA priority and suppression rules; support/operational issues outrank commerce.

## 9. TAPP and native app double-message the same customer

**Risk:** Native education/check-ins launch before TAPP/lifecycle suppression is coordinated.

- Impact: Medium/High
- Likelihood: Medium
- Owner: Product/Lifecycle/Data
- Mitigation: explicit migration/cutover rules, completion-state mapping, issue #10.

## 10. Content/claim drift

**Risk:** Health/product copy changes in app code without approved claims/disclaimers.

- Impact: High
- Likelihood: Medium
- Owner: Product/Content/Medical
- Mitigation: governed CMS/config, approval states, claim/disclaimer IDs, versioning.

## 11. Sensitive wellness data expands product scope accidentally

**Risk:** Check-ins/labs turn the app into a more clinically sensitive system without deliberate governance.

- Impact: Critical
- Likelihood: Medium
- Owner: Product/Privacy/Medical
- Mitigation: explicit consent, data minimization, separate approval for lab interpretation, `SECURITY-PRIVACY-MEDICAL.md`.

## 12. Vendor outage breaks entire Home

**Risk:** One upstream failure prevents all member utility.

- Impact: High
- Likelihood: Medium
- Owner: Engineering
- Mitigation: BFF module isolation, graceful degradation, safe caches for content, suppress non-critical modules.

## 13. Vendor-specific payloads leak into UI

**Risk:** React components couple directly to Skio/Shopify structures, making changes brittle.

- Impact: Medium/High
- Likelihood: Medium
- Owner: Engineering
- Mitigation: adapters + stable Dose API/domain contracts; contract tests.

## 14. Recommendation/add-on changes primary subscription unexpectedly

**Risk:** Cross-sell action causes unintended subscription/product state.

- Impact: Critical
- Likelihood: Low/Medium
- Owner: Engineering/Product
- Mitigation: explicit supported mutation semantics, confirmation, idempotency, source re-read, pilot gating.

## 15. Push/reminders become spammy or conflict with lifecycle messages

**Risk:** App notifications stack with Klaviyo/SMS and increase opt-outs/friction.

- Impact: Medium/High
- Likelihood: Medium
- Owner: Lifecycle/Product
- Mitigation: member-controlled timing, channel pressure governance, consent, experiment guardrails.

## 16. Pilot support burden exceeds capacity

**Risk:** Identity/integration defects create CX volume that obscures product learnings.

- Impact: High
- Likelihood: Medium
- Owner: Product/CX/Engineering
- Mitigation: narrow cohort, support macros/training, request IDs, internal state troubleshooting, staged ramp.

## 17. Loyalty/rewards overbuild distracts from core retention utility

**Risk:** Team invests in points/gamification before proving routine/readiness/subscription value.

- Impact: Medium
- Likelihood: Medium
- Owner: Product/Retention
- Mitigation: integrate existing system; keep P1; prioritize purposeful milestones and retention proof.

## 18. Scope creep into storefront/telehealth/health dashboard

**Risk:** V1 becomes too broad to ship and measure.

- Impact: High
- Likelihood: High
- Owner: Product DRI
- Mitigation: explicit non-goals in PRD/README; roadmap phase gates.

## 19. No admin/config layer creates engineering bottleneck

**Risk:** Every education/milestone/recommendation change requires a release.

- Impact: Medium
- Likelihood: High
- Owner: Product/Engineering
- Mitigation: minimum viable CMS/rule controls, not a broad internal dashboard.

## 20. Admin/rules layer becomes an opaque second codebase

**Risk:** Business users can make untraceable changes with no version/audit history.

- Impact: High
- Likelihood: Medium
- Owner: Engineering/Product
- Mitigation: RBAC, versions, approval workflow, audit log, rollback.

## 21. Source metric definitions diverge

**Risk:** App team invents alternate retention/save/conversion denominators.

- Impact: High
- Likelihood: Medium
- Owner: Analytics/Data
- Mitigation: governed warehouse definitions; documented KPI contracts; reconcile with Retention Intelligence.

## 22. Public repository leaks internal/customer data

**Risk:** test credentials, PII, private links or internal datasets are committed.

- Impact: Critical
- Likelihood: Medium
- Owner: Engineering/all contributors
- Mitigation: `.env.example` placeholders only, synthetic data, secret scanning, PR checklist, never commit personal emails/tracking params.

## 23. Accessibility is deferred until late

**Risk:** polished visual app fails keyboard/screen reader/touch/zoom use and requires expensive rework.

- Impact: Medium/High
- Likelihood: Medium
- Owner: Design/Engineering/QA
- Mitigation: accessibility in Definition of Done, automated smoke checks, device QA from Phase 1.

## 24. Vercel/demo environment is mistaken for production architecture

**Risk:** demo shortcuts become implicit production assumptions.

- Impact: Medium
- Likelihood: Medium
- Owner: Engineering/Product
- Mitigation: clear environment taxonomy, production contracts in docs, demo remains labeled/mock-first.

## 25. Risk review cadence

Review this register:
- at architecture decisions
- at sprint planning for relevant risks
- weekly during pilot
- after every incident or material data discrepancy

Any Critical risk with no active mitigation/owner blocks pilot expansion.