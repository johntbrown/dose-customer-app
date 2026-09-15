# Subscription Action Engineering Plan

## Executive summary

My Plan should be implemented as a fault-tolerant orchestration layer over the existing Dose stack. The app owns customer experience, action eligibility, confirmation UX, and event emission. Skio remains the source of truth for subscription state and mutations. Shopify remains the commerce/customer context source. RudderStack carries app interaction events. BigQuery / Customer 360 computes durable lifecycle, risk, and eligibility state. Klaviyo and Postscript consume approved state for messaging. Gorgias / CX owns support-required paths.

The engineering goal is not to recreate subscription management. It is to make the existing stack feel like one coherent product.

---

## 1. Non-negotiable architecture principles

### 1.1 Single source of truth

The app never treats local state as authoritative for subscription status, cadence, quantity, next order date, product configuration, or billing state.

Every completed mutation must be followed by a fresh read from Skio before success is shown to the customer.

### 1.2 Canonical identity

All requests begin with a trusted `dose_customer_id` resolved server-side. The app then maps that identity to the correct vendor identifiers.

Required identity graph:

- dose_customer_id
- Shopify customer ID
- Skio customer ID
- Skio subscription ID
- Klaviyo profile ID
- RudderStack user ID
- Gorgias customer ID where available

Email is a lookup attribute, not the primary key.

### 1.3 Server-side mutation boundary

All subscription writes happen server-side. No Skio credentials or mutation logic should be exposed to browser code.

### 1.4 Idempotent actions

Every write action receives an idempotency key. Repeated button clicks, browser retries, mobile network retries, and API retries must not produce duplicate mutations.

Recommended key shape:

`dose_customer_id + subscription_id + action_type + requested_value + client_action_id`

### 1.5 Read-after-write confirmation

A mutation is not considered complete because a vendor API returned HTTP 200. The app re-fetches the plan and confirms the intended state before emitting the final success event.

### 1.6 Eligibility before execution

The app evaluates whether an action is available before presenting or executing it. Eligibility should be based on fresh plan state plus approved Customer 360 flags.

### 1.7 Event truth vs state truth

RudderStack records what the customer did in the app. Skio and Customer 360 determine what the subscription actually became.

---

## 2. Recommended service boundaries

```text
Browser UI
  -> Next.js server action / API route
    -> Plan Action Orchestrator
      -> Identity Resolver
      -> Eligibility Service
      -> Subscription Gateway
        -> Skio Adapter
      -> Read-after-write Verification
      -> Event Adapter
        -> RudderStack
      -> Result Mapper
        -> UI response
```

Supporting reads:

```text
Identity Resolver
  -> Customer 360 / mapping table
  -> Shopify context
  -> Skio identifiers
```

No UI component should call Skio directly.

---

## 3. V1 supported actions

### 3.1 Skip next order

Preconditions:
- active eligible subscription
- not already skipped for the same cycle
- no unresolved mutation in progress
- action allowed by commitment / plan rules

Flow:
1. create action request
2. validate identity and ownership
3. load fresh Skio plan state
4. run eligibility checks
5. emit `app_plan_action_started`
6. execute skip through Skio adapter
7. re-fetch plan
8. verify next order state changed as expected
9. emit `app_plan_action_completed`
10. return fresh plan snapshot

If verification fails, return an indeterminate state and do not display a definitive success message.

### 3.2 Change next order date

Additional validation:
- accepted date window
- date is in the future
- shipping / fulfillment cutoff rules respected
- date does not conflict with plan restrictions

Important Dose-specific consideration: post-charge shipment risk means date changes close to fulfillment cutoff must be handled conservatively. The UI should distinguish between changing a future renewal and attempting to alter an already-processed order.

### 3.3 Change cadence

V1 should use a controlled set of supported cadence options rather than arbitrary free-form input.

Recommended experience:
- show current cadence
- show available supported cadences
- explain how the next order date changes
- confirm before executing

Inventory-fit signals can influence which cadence is recommended, but they must not silently change the subscription.

### 3.4 Change quantity

Rules:
- validate available quantity options for the product
- recalculate expected order configuration
- show customer the proposed configuration before confirmation
- refresh Skio after mutation

### 3.5 Product change

Treat product change as a higher-risk action than cadence or quantity.

Requirements:
- approved product mapping
- eligibility rules
- clear explanation of what changes
- no unsupported medical or diagnostic recommendation
- audit event capturing source product and destination product

### 3.6 Pause

Only display when supported for the current plan. Do not simulate pause through repeated skips unless explicitly approved as product logic.

---

## 4. Plan-action request contract

Every mutation request should include:

- action_id
- dose_customer_id
- subscription_id
- action_type
- requested_value
- client_timestamp
- source_surface
- reason / context when applicable
- idempotency_key

Server-added metadata:

- server_timestamp
- current_plan_version or fingerprint
- authenticated user/session identifier
- resolved Skio customer ID
- request correlation ID

---

## 5. Concurrency and stale-state protection

Subscription state can change outside the app through Skio, CX, billing, or other systems.

Before each mutation:
1. fetch current state
2. compare against the state the UI was rendered from
3. reject or re-confirm if materially changed

Examples of material changes:
- next order date moved
- plan status changed
- quantity changed
- another skip already occurred
- billing state changed

Return a specific `STALE_PLAN_STATE` result so the UI can refresh instead of displaying a generic failure.

---

## 6. Action lifecycle state machine

```text
idle
 -> validating
 -> eligible
 -> confirming
 -> submitting
 -> vendor_accepted
 -> verifying
 -> succeeded

Failure branches:
 validating -> ineligible
 submitting -> failed
 verifying -> indeterminate
 any step -> stale_state
```

The UI should render these states intentionally rather than relying on one generic loading boolean.

---

## 7. Error taxonomy

Use stable application error codes rather than exposing vendor error messages directly.

Recommended codes:

- UNAUTHENTICATED
- IDENTITY_NOT_RESOLVED
- PLAN_NOT_FOUND
- PLAN_NOT_OWNED_BY_CUSTOMER
- ACTION_NOT_SUPPORTED
- ACTION_NOT_ELIGIBLE
- STALE_PLAN_STATE
- INVALID_REQUEST
- FULFILLMENT_CUTOFF_REACHED
- VENDOR_TEMPORARILY_UNAVAILABLE
- VENDOR_REJECTED_ACTION
- VERIFICATION_FAILED
- EVENT_TRACKING_FAILED
- UNKNOWN_ERROR

Customer-facing copy should be separate from internal error diagnostics.

---

## 8. Retry policy

Reads:
- safe to retry with bounded exponential backoff

Writes:
- retry only when protected by idempotency
- never blindly replay a mutation if vendor outcome is unknown
- if response is ambiguous, fetch current state first

Recommended pattern:
1. mutation request times out
2. read current plan state
3. if desired state already exists, treat as successful
4. otherwise retry with same idempotency key if supported
5. if still ambiguous, return indeterminate state and offer support / retry

---

## 9. Observability

Every action should have a correlation ID shared across logs, vendor calls, and analytics events.

Log fields:
- correlation_id
- action_id
- dose_customer_id
- subscription_id
- action_type
- eligibility_result
- vendor_latency_ms
- vendor_response_class
- verification_result
- total_latency_ms

Do not log secrets, payment details, or unnecessary PII.

Metrics:
- action attempts
- eligibility failures
- mutation success rate
- verification failure rate
- vendor latency p50 / p95 / p99
- stale-state rate
- duplicate request rate
- support handoff rate
- action completion to next rebill retention

---

## 10. RudderStack event contract

### app_plan_action_started
Properties:
- action_id
- dose_customer_id
- subscription_id
- action_type
- source_surface
- plan_status
- product
- lifecycle_stage

### app_plan_action_completed
Add:
- outcome
- previous_value
- new_value
- verification_status
- duration_ms

### app_plan_action_failed
Add:
- error_code
- failure_stage
- retryable

### app_inventory_fit_selected
Properties:
- inventory_fit
- product
- cadence_days
- days_until_next_order

Analytics events should not be used as confirmation that the subscription changed.

---

## 11. Cancellation / save integration

The plan action layer should support retention actions used by the cancellation experience, but cancellation decisioning remains a separate domain service.

The hierarchy remains:
1. solve operational problem
2. adjust cadence / date / quantity
3. review product fit
4. address progress-confidence issue
5. route support-only cases
6. use financial incentive when price is the actual unresolved barrier

The cancellation flow should call the same plan action service as My Plan. There should not be separate skip or cadence implementations inside cancellation logic.

---

## 12. Commitment-plan handling

Commitment status should be read from authoritative upstream state.

Rules:
- action eligibility can differ for commitment customers
- unsupported exits must not be exposed as normal self-service options
- approved exception paths should hand off with context
- analytics must preserve commitment-plan status at the time of action

---

## 13. Dunning precedence

When a customer is in an unresolved payment-recovery state:
- payment recovery takes priority in My Plan
- unrelated upsell / loyalty actions should be suppressed
- plan actions that could create confusing downstream billing behavior should be reviewed for eligibility
- the app should not infer dunning from failed app actions; use authoritative state

---

## 14. Security requirements

- server-only vendor credentials
- authenticated session required for mutations
- customer ownership verified server-side
- CSRF protection for mutation endpoints
- strict request validation
- allowlisted action types and values
- rate limiting for writes
- no raw vendor errors shown to users
- structured audit logging
- secrets only through environment / secret manager

---

## 15. Testing strategy

### Unit tests
- eligibility rules
- action payload validation
- idempotency key generation
- result mapping
- error mapping
- recommendation logic

### Contract tests
- Skio adapter request / response fixtures
- schema compatibility
- unsupported or partial vendor responses

### Integration tests
- mutate mock plan then read-after-write
- timeout + verification recovery
- duplicate request idempotency
- stale plan rejection

### UI tests
- loading state
- eligibility-disabled state
- confirmation state
- success state using refreshed data
- indeterminate state
- accessible keyboard and screen-reader behavior

### Analytics tests
- one started event per action attempt
- one terminal event per action
- no completed event before verification
- action and correlation IDs consistent

---

## 16. Delivery sequence

### Phase A: contracts
- action types and schemas
- error taxonomy
- eligibility interface
- subscription gateway interface
- analytics event contract

### Phase B: mock action engine
- deterministic in-memory Skio adapter
- skip / date / cadence / quantity actions
- idempotency simulation
- read-after-write verification
- automated tests

### Phase C: My Plan UI
- action cards
- confirmation dialogs
- optimistic-looking but verification-backed UX
- stale-state refresh
- explicit error states

### Phase D: real Skio adapter
- authenticated server-side client
- request / response mapping
- action eligibility parity with portal
- sandbox / test customer validation

### Phase E: data and lifecycle integration
- RudderStack events
- BigQuery validation
- Customer 360 derived state
- Klaviyo / Postscript activation use cases

### Phase F: cancellation/save reuse
- cancellation decision service calls shared plan actions
- CX handoff
- support context packet
- save effectiveness reporting

---

## 17. Definition of done for each action

An action is production-ready only when:
- customer ownership is verified
- eligibility is explicit
- request schema is validated
- write is idempotent
- vendor response is mapped
- read-after-write confirms the state
- success and failure states are user-safe
- RudderStack terminal event is emitted
- logs contain correlation ID
- unit and integration tests exist
- analytics can connect the action to later rebill / retention outcomes
- support has a documented fallback path

---

## 18. First engineering tickets

1. Define `PlanActionRequest`, `PlanActionResult`, and error-code types.
2. Create `SubscriptionGateway` interface with read and mutation methods.
3. Create `EligibilityService` interface and initial rule engine.
4. Implement deterministic mock gateway.
5. Implement idempotency store abstraction.
6. Implement action orchestrator with read-after-write verification.
7. Add RudderStack event adapter terminal events.
8. Add unit tests for skip and cadence changes.
9. Add API route / server action boundary.
10. Add My Plan action UI only after the service layer passes tests.

This sequence keeps the product polished while ensuring the underlying system is safe, testable, and replaceable when the real Skio integration is connected.
