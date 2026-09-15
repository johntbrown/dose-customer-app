# My Dose Data Contracts

## Purpose

This document defines the **canonical app-facing member state**, field ownership, identity rules, freshness expectations and data-quality requirements. The goal is to prevent the app from repeating the current lifecycle pattern where raw platform properties are repeatedly re-evaluated across flows and surfaces.

## Core rule

**One question → one agreed app-facing field.**

The app should not ask multiple raw properties to answer the same business question when a normalized property can safely exist upstream.

Events answer: **what happened, and when?**

Properties answer: **what is true now / who is eligible?**

## 1. Canonical identity

Primary key: `dose_customer_id`.

Required identity map:

```text
dose_customer_id
app_user_id
shopify_customer_id
skio_customer_id
klaviyo_profile_id
rudderstack_user_id
email_normalized
phone_e164 (only when available/consented)
identity_status
identity_updated_at
```

### Rules
- Never use email as the only durable business key.
- Identity resolution happens server-side.
- Anonymous activity can use `anonymous_id` until login, then alias/merge through the event layer according to the approved identity plan.
- Duplicate Shopify/Skio identities require an explicit reconciliation path; do not silently pick arbitrary records.
- Identity failures are observable and supportable.

### Identity states
- `resolved`
- `partial`
- `ambiguous`
- `not_found`
- `blocked`

## 2. System-of-record matrix

| Question | Authoritative source | App-facing normalized output |
| --- | --- | --- |
| Is customer an active subscriber? | Skio / governed state layer | `is_active_subscriber` |
| What products are active? | Skio + Shopify mapping | `owned_products[]` |
| Primary product | Governed business rule | `primary_product` |
| Bundle status | Product ownership mapping | `is_bundle` |
| Serving size / oz | SKU/product mapping | `dose_oz` |
| Current subscription cycle | Skio/warehouse | `subscription_cycle` |
| Next charge date | Skio | `next_bill_at` |
| Next expected shipment | Skio/Shopify | `next_ship_at` |
| Order history | Shopify | `orders[]` |
| Tracking | Shopify fulfillment / carrier source | normalized `tracking` |
| Lifecycle day/month | normalized customer-state layer | `lifecycle_day`, `lifecycle_month` |
| Churn risk | warehouse/approved model | `churn_risk_state` |
| Routine adherence | app-owned routine events | `adherence_7d`, `adherence_30d` |
| Streak | app-owned routine history | `current_streak` |
| Check-in state | app/TAPP migration layer | `check_in_state` |
| Support need | normalized check-in/service state | `needs_support` |
| Cross-sell target | recommendation rules | `cross_sell_target` |
| Review eligibility | Okendo/governed rule | `review_eligible` |
| Commitment eligibility/status | governed offer state | `commitment_*` |
| Loyalty/reward state | loyalty system | `reward_state` |
| Experiment assignment | app experimentation store | `experiments{}` |

## 3. Canonical member-state object

```json
{
  "identity": {
    "dose_customer_id": "dc_123",
    "status": "resolved"
  },
  "profile": {
    "first_name": "Alex",
    "locale": "en-US",
    "timezone": "America/New_York"
  },
  "subscription": {
    "is_active_subscriber": true,
    "status": "active",
    "cycle": 2,
    "primary_product": "liver",
    "owned_products": ["liver"],
    "is_bundle": false,
    "dose_oz": 2,
    "quantity": 1,
    "cadence_days": 24,
    "next_bill_at": "2026-09-28T10:00:00Z",
    "next_ship_at": "2026-09-29T10:00:00Z"
  },
  "lifecycle": {
    "day": 43,
    "month": 2,
    "stage": "m2",
    "churn_risk_state": "medium",
    "next_best_action": "complete_m2_checkin"
  },
  "routine": {
    "start_date": "2026-08-04",
    "serving_goal": "daily",
    "reminder_enabled": true,
    "reminder_local_time": "08:00",
    "current_streak": 6,
    "adherence_7d": 0.86,
    "adherence_30d": 0.82,
    "today_status": "not_logged"
  },
  "progress": {
    "check_in_state": "due",
    "last_check_in_at": null,
    "self_reported_progress": null,
    "bloodwork_interest": true
  },
  "support": {
    "needs_support": false,
    "concierge_eligible": true,
    "concierge_status": "not_booked",
    "nutritionist_eligible": true,
    "nutritionist_status": "not_booked"
  },
  "education": {
    "program_id": "liver_m1_v1",
    "completed_module_ids": ["liver_m1_day_1"],
    "next_module_id": "liver_m1_day_2"
  },
  "commerce": {
    "last_order_id": "gid://shopify/Order/...",
    "active_order_status": "in_transit"
  },
  "eligibility": {
    "review_eligible": false,
    "cross_sell_target": "cholesterol",
    "commitment_eligible": true,
    "commitment_status": "eligible"
  },
  "rewards": {
    "status": "active",
    "next_milestone": "order_3",
    "available_benefits": []
  },
  "consent": {
    "email": true,
    "sms": true,
    "push": false,
    "optional_health_data": false
  },
  "experiments": {
    "home_nba_v1": "treatment"
  },
  "freshness": {
    "subscription_at": "2026-09-15T20:00:00Z",
    "orders_at": "2026-09-15T20:00:00Z",
    "derived_state_at": "2026-09-15T19:55:00Z"
  }
}
```

## 4. Product ownership normalization

Do not route the app directly on raw SKU lists.

Normalized fields:

```text
primary_product: liver | cholesterol | blood_pressure | other
owned_products: string[]
is_bundle: boolean
dose_oz: 2 | 4 | null
```

Rules:
- `owned_products` reflects current relevant ownership, not historical purchase only.
- bundle customers set both owned product booleans as appropriate.
- cross-sell logic suppresses already-owned products.
- future products plug into the same structure without duplicating page logic.

## 5. Subscription normalization

```text
is_active_subscriber
subscription_status
subscription_cycle
quantity
cadence_days
next_bill_at
next_ship_at
payment_status
subscription_updated_at
```

Status enum should be explicit and mapped from Skio:

```text
active
paused
cancelled
failed
expired
unknown
```

Do not infer active state from order recency alone.

## 6. Lifecycle normalization

Lifecycle should not depend on a flow-created tag when the underlying subscription cycle can answer the question.

Recommended:

```text
lifecycle_day
lifecycle_month
lifecycle_stage
subscription_cycle
```

Example stages:
- `pre_delivery_m1`
- `post_delivery_m1`
- `pre_delivery_m2`
- `post_delivery_m2`
- `m3_plus`
- `lapsed`

## 7. Support state

Normalize support need into one field across products:

```text
needs_support: boolean
support_reason: string|null
support_detected_at
support_resolved_at
```

Sources can include native app check-ins or TAPP during migration.

Operational rule:
- if `needs_support=true`, support/service actions outrank merchandising recommendations.

## 8. Commitment / offer state

Avoid repeated event checks in every surface.

```text
commitment_eligible: boolean
commitment_status: ineligible | eligible | engaged | converted | expired
commitment_offer_id
commitment_updated_at
```

All channels should consume the same state.

## 9. Cross-sell state

```text
cross_sell_target: liver | cholesterol | blood_pressure | null
cross_sell_reason
cross_sell_eligible: boolean
cross_sell_updated_at
```

Initial rules:
- Liver, no Cholesterol → Cholesterol
- Cholesterol, no Liver → Liver
- Liver + Cholesterol → null for these two products
- unresolved support/order/subscription issues can suppress cross-sell

## 10. Review state

```text
review_eligible: boolean
review_product_target
review_requested_at
review_completed_at
```

Okendo remains execution/source where appropriate. The app should consume one eligibility decision.

## 11. Routine data model

App-owned durable state:

```text
routine_profile
  dose_customer_id
  start_date
  serving_goal
  reminder_enabled
  reminder_local_time
  timezone
  created_at
  updated_at

routine_log
  id
  dose_customer_id
  local_date
  status: taken | later | skipped | missed
  logged_at
  source: app | imported
```

Rules:
- one final routine state per local date; changes are auditable
- adherence calculation is documented and versioned
- timezone changes do not rewrite historical local dates

## 12. Check-in data

```text
check_in
  id
  dose_customer_id
  check_in_type: m1 | m2 | m3 | ad_hoc
  started_at
  completed_at
  version
  outcome_state

check_in_answer
  check_in_id
  question_id
  answer_value
  answered_at
```

Only collect fields with a defined product purpose. Optional health-marker data needs explicit consent and separate review.

## 13. Education data

```text
education_progress
  dose_customer_id
  program_id
  module_id
  status: locked | available | started | completed
  started_at
  completed_at
  version
```

TAPP history can be normalized into this model if export/backfill is feasible.

## 14. Experiment assignments

```text
experiment_assignment
  dose_customer_id
  experiment_id
  variant
  assigned_at
  assignment_version
  eligibility_snapshot
```

Assignment must persist. Do not re-randomize on every app open.

## 15. Data freshness and latency

Operational fields must come from operational systems or near-real-time normalized state.

Suggested expectations:
- auth/identity: session-time
- subscription: real-time/read-through or webhook-fresh
- order/fulfillment: webhook/API-fresh
- routine/check-ins: immediate app write
- next-best action: recompute after meaningful state change or bounded cache
- warehouse-derived retention/risk: documented batch SLA

Every aggregate payload should expose freshness timestamps for fields where stale state could mislead a member.

## 16. Data quality checks

Automated monitors should cover:
- % authenticated users with resolved Shopify ID
- % subscribers with resolved Skio ID
- multiple active subscriptions unexpectedly mapped to one primary product
- missing/unknown subscription status
- impossible next-bill dates
- lifecycle stage inconsistent with subscription cycle
- duplicate routine logs
- cross-sell target already owned
- recommendation served while suppression reason exists
- event missing `dose_customer_id` after authentication
- event/schema version mismatch

## 17. Klaviyo profile outputs

Only push durable, activation-useful state, not every app detail.

Candidate properties:

```text
dose_primary_product
dose_owned_products
dose_is_active_subscriber
dose_subscription_cycle
dose_lifecycle_stage
dose_needs_support
dose_cross_sell_target
dose_review_eligible
dose_commitment_status
dose_app_activated
dose_app_last_active_at
dose_last_check_in_type
dose_last_check_in_at
```

Use events for lesson completion, booking, routine actions and other time-based behavior.

## 18. Data privacy classification

Classify fields before implementation:
- public/content
- internal operational
- PII
- sensitive wellness / optional health-marker data

Do not send sensitive values into analytics tools unless explicitly approved and necessary.

## 19. Change management

Any change to a canonical field requires:
1. owner
2. definition
3. source
4. type/enum
5. null behavior
6. freshness SLA
7. downstream consumers
8. migration plan
9. analytics impact
10. documentation update

## 20. Definition of success

A screen should never need to understand the quirks of Shopify/Skio/Klaviyo property names. The app consumes stable Dose domain concepts. Vendor-specific complexity stays behind adapters and normalized customer state.