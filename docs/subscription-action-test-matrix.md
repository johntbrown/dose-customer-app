# Subscription Action Test Matrix

This matrix defines the minimum quality bar before any real Skio write action is enabled.

## Core invariants

1. A customer can never mutate a plan they do not own.
2. A duplicate request can never create a duplicate plan change.
3. The UI never reports success before refreshed subscription state confirms the intended result.
4. Vendor timeouts never cause a blind replay of an unknown mutation.
5. Analytics completion events never fire before verification.
6. Stale UI state never silently overwrites a newer subscription change.
7. Support-only and commitment-plan rules remain enforceable outside the UI.

## Test cases

| Area | Scenario | Expected result |
| --- | --- | --- |
| Identity | dose_customer_id does not match authenticated user | reject before vendor call |
| Ownership | subscription belongs to another customer | reject before mutation |
| Validation | unsupported cadence value | INVALID_REQUEST |
| Validation | next date is in the past | INVALID_REQUEST |
| Eligibility | plan state does not allow requested action | ACTION_NOT_ELIGIBLE |
| Stale state | cadence changed after page render | STALE_PLAN_STATE and refresh |
| Idempotency | same action submitted twice | one vendor mutation, stable result |
| Idempotency | browser retries after timeout | verify current state before retry |
| Vendor | transient read failure | bounded retry |
| Vendor | mutation rejected | VENDOR_REJECTED_ACTION |
| Vendor | mutation timeout, desired state exists on refresh | treat as successful after verification |
| Vendor | mutation timeout, state unchanged | retry only with same idempotency key or return indeterminate |
| Verification | vendor accepted but refreshed state does not match | VERIFICATION_FAILED |
| Analytics | action starts | exactly one started event with action/correlation IDs |
| Analytics | action verifies | exactly one completed event |
| Analytics | action fails | failed terminal event, no completed event |
| Dunning | unresolved payment state | suppress ineligible unrelated actions |
| Commitment | restricted plan action | enforce upstream eligibility rule |
| Fulfillment | date change after operational cutoff | FULFILLMENT_CUTOFF_REACHED |
| UX | action in progress | controls disable safely without losing context |
| UX | stale state | explain refresh without blaming customer |
| Accessibility | keyboard-only mutation flow | all controls reachable and labeled |

## Per-action acceptance tests

### Skip
- valid active plan can skip once
- already-skipped cycle cannot be skipped again
- post-action refresh reflects new schedule/state
- duplicate request is idempotent

### Change next order date
- supported future date succeeds
- invalid date rejected before vendor call
- fulfillment cutoff protected
- new date confirmed by re-read

### Change cadence
- only allowlisted cadence values accepted
- recommendation never auto-mutates
- old and new cadence recorded in event payload

### Change quantity
- only valid product quantity combinations accepted
- refreshed plan confirms quantity

### Product change
- source and destination products recorded
- unsupported mapping rejected
- no product recommendation logic makes unsupported health claims

### Pause
- only rendered when supported
- no repeated-skip workaround unless explicitly approved

## Non-functional tests

### Performance
- plan reads p95 target defined before production rollout
- mutation orchestration p95 monitored separately from vendor latency

### Resilience
- vendor read outage
- vendor mutation outage
- analytics outage does not roll back a verified subscription mutation
- duplicate event delivery tolerated downstream

### Security
- forged subscription ID
- manipulated requested value
- missing authentication
- expired session
- CSRF attempt
- write-rate abuse
- logs inspected for accidental PII/secrets

## Production rollout

1. internal test accounts
2. sandbox / safe test subscriptions
3. employee dogfood cohort
4. limited percentage of eligible subscribers
5. monitor action success, verification failures, support contacts, and vendor errors
6. expand only after error rate and reconciliation are stable

## Required dashboards before full rollout

- action attempts by type
- verified success rate
- eligibility rejection rate
- stale-state rate
- verification failure rate
- vendor error rate and latency
- support handoff rate
- downstream next-rebill retention by action type
- inventory-fit signal distribution and later plan behavior
