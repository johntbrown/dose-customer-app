# ADR 0003: Normalize customer state upstream; use events for behavior

- Status: Accepted
- Date: 2026-09-15

## Context

Dose lifecycle architecture currently carries significant repeated logic across product, serving-size, subscription and content branches. Repeatedly re-evaluating raw platform properties increases QA burden and creates inconsistent routing risk.

## Decision

The app and lifecycle channels consume normalized Dose-domain state such as:
- `primary_product`
- `owned_products`
- `subscription_cycle`
- `lifecycle_stage`
- `needs_support`
- `cross_sell_target`
- `review_eligible`
- `commitment_status`
- `next_best_action`

Use events for time-based actions such as:
- routine action logged
- check-in completed
- lesson completed
- service booked
- subscription change completed
- recommendation viewed/clicked/added

Use properties for current state/eligibility.

## Consequences

Positive:
- one routing decision can serve app + Klaviyo + analytics
- less duplicated branching
- easier QA and future product expansion
- more explainable next-best-action logic

Tradeoffs:
- upstream transformation/data ownership must be explicit
- stale state needs freshness SLAs
- schema changes need governance

## Guardrail

A new raw vendor property should not be introduced directly into UI routing if an existing canonical Dose field answers the business question.