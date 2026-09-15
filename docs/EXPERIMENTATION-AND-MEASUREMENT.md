# My Dose Experimentation & Measurement

## Purpose

The app is a retention investment. Measurement must answer whether app adoption and continued engagement improve **subscription survival and LTV**, not merely whether customers open the app.

## 1. North-star business question

**Does My Dose improve subscription survival and customer value relative to the best available comparable/holdout experience?**

## 2. Primary outcome metrics

### Retention
- D24 subscription survival / successful rebill
- D48 subscription survival
- D72 subscription survival
- D90 active subscriber rate
- M3 retention
- cancellation rate by lifecycle window
- save/recovery rate when subscription changes are attempted

### Value
- LTV by app adoption/cohort/experiment
- cumulative revenue per subscriber
- incremental orders
- cross-sell / add-on revenue
- quantity/cadence/right-size outcomes

Do not optimize app decisions around opens/clicks if business retention/value does not improve.

## 3. Diagnostic metric tree

### Activation
- authenticated app activation
- first-login completion
- routine setup
- reminder opt-in
- push opt-in where applicable

### Routine
- daily logging adoption
- 7d/30d adherence
- streaks
- reminder usage
- missed-day recovery

### Progress/readiness
- expectation content viewed
- M1/M2/M3 check-in completion
- confidence/support outcomes
- education completion

### Services
- concierge views/booking
- nutritionist views/booking
- support contact rate and resolution where available

### Control
- subscription page view
- skip/date/quantity action starts and completions
- mutation failure rate
- order tracking usage

### Commerce
- recommendation impressions
- clicks
- add-to-next-order
- purchases
- incremental cross-sell revenue

### Loyalty
- milestone reached
- benefit viewed
- reward redeemed
- referral starts/conversions

## 4. First-90-day measurement framework

### Day 0 — Set up routine
Leading metrics:
- activation
- serving/routine setup
- reminder adoption
- product education start

Business hypothesis: early readiness reduces avoidable confusion and early cancel intent.

### Day 24 — Protect rebill
Leading metrics:
- next order viewed
- payment/subscription issues resolved
- expectation reset viewed
- skip/change-date behavior

Outcome: successful first rebill / D24 survival.

### Day 48 — Prove value
Leading metrics:
- M2 check-in completion
- progress confidence
- concierge/nutritionist engagement
- right-size subscription actions

Outcome: D48 survival and reduced unresolved concern.

### Day 72 — Reinforce proof
Leading metrics:
- milestone viewed
- education/proof engagement
- reward/benefit engagement

Outcome: D72 survival.

### Day 90 — Reflect + reward
Leading metrics:
- progress summary engagement
- milestone/reward
- next-journey engagement

Outcome: D90 active status and forward LTV.

## 5. Experiment architecture

Every experiment requires:
- experiment ID
- hypothesis
- eligibility
- assignment unit
- variants
- assignment version
- exposure definition
- primary metric
- guardrails
- minimum runtime/sample logic
- analysis plan
- owner

Assignment unit should normally be `dose_customer_id` and persist across sessions.

## 6. Holdouts

Where practical, maintain an app-eligible holdout or feature-level holdout to estimate incremental effect.

Avoid comparing highly engaged app users to non-users without controlling for self-selection; app adoption is likely correlated with customer readiness.

Potential designs:
- invite-level randomized holdout
- feature flag randomized control/treatment
- staged rollout with pre-defined cohorts
- matched cohort only when randomization is impossible, clearly labeled observational

## 7. Example experiments

### A. Routine reminder
Hypothesis: member-controlled reminders increase adherence and D24 survival.

Primary diagnostic: 14-day adherence.
Primary business outcome: D24 survival.
Guardrails: notification opt-out, support complaints.

### B. Month 1 expectation framing
Hypothesis: explicit expectation timeline reduces early disappointment and cancellation.

Primary diagnostic: expectation content completion / confidence.
Outcome: cancellation before D48.

### C. Concierge risk routing
Hypothesis: surfacing concierge after low-confidence check-in improves retention among risk customers.

Primary diagnostic: booking/completion.
Outcome: D48/D72 survival.

### D. Cross-sell slot
Hypothesis: eligibility-based complementary product recommendation increases incremental revenue without harming subscription survival.

Primary: incremental cross-sell purchase.
Guardrails: cancellation, support/contact rate, primary-subscription changes.

### E. Loyalty milestone
Hypothesis: purposeful milestone benefit at Order 3/D72 improves D90 survival.

Primary diagnostic: redemption.
Outcome: D90 survival / future orders.

## 8. Exposure requirements

Assignment ≠ exposure.

An `experiment_exposed` event should fire when the member actually receives the treatment in a meaningful way.

Store:
- experiment ID
- variant
- exposure timestamp
- surface
- rule/content version

## 9. Mixpanel dashboards

Recommended:

### Activation funnel
Authenticated → splash complete → Home → routine setup → first routine log.

### Routine funnel
Home → routine action → repeat within 7d → 30d adherence.

### Education funnel
Program view → module start → module complete → full program complete.

### Subscription self-service
Plan view → action start → success/failure → subsequent cancellation/retention.

### Services
Service view → booking start → booking complete → downstream retention cohort.

### Discover
Recommendation impression → click → add → purchase.

## 10. Warehouse reporting

Official reporting should reconcile app data to:
- Shopify orders/revenue
- Skio active/cancel/renewal state
- cancellation/save datasets
- customer cohort/LTV tables
- experiment assignments/exposures

Mixpanel is not the source for official revenue or subscriber survival counts.

## 11. Data reconciliation

Before trusting a dashboard:
- compare unique authenticated users vs canonical customer accounts
- validate browser/device inflation
- reconcile app event counts to server logs for critical mutations
- reconcile subscription success events to Skio
- reconcile commerce events to Shopify
- validate cohort dates/timezones

This explicitly avoids repeating historical cases where browser/device counts and customer-account counts were hard to reconcile.

## 12. Segmentation dimensions

Analysis should support:
- primary product
- product ownership/bundle
- lifecycle month/cycle
- new vs returning subscriber
- app activation cohort
- risk state
- adherence band
- support-need state
- service usage
- offer/commitment state
- acquisition source/path where available
- experiment variant

## 13. Guardrails

Every growth/retention experiment should consider:
- cancellation
- refund/contact volume
- subscription mutation errors
- opt-out/uninstall/notification disable
- support burden
- product returns/issues
- revenue cannibalization
- experience latency/reliability

## 14. Decision standard

Do not declare a winner from directional feature metrics alone. A treatment can increase clicks or app engagement while worsening customer quality or retention.

Decision hierarchy:
1. incremental business outcome
2. customer risk/guardrails
3. supporting behavioral mechanism
4. operational/resource impact

## 15. Analytics acceptance criteria for features

A feature is not production complete until:
- events are specified
- exposure is specified if experimental
- Mixpanel QA is complete
- warehouse ingestion is verified where required
- source-system reconciliation exists for critical outcomes
- owner/dashboard is identified
- decision rule is documented.