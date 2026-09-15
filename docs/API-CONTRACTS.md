# My Dose API Contracts

## Purpose

Define the contract between the app client and the Dose backend-for-frontend (BFF). The client should consume stable Dose domain objects, never raw Skio/Shopify/Klaviyo payloads.

## API principles

- version critical routes under `/api/v1`
- authenticate every member-scoped route
- authorize ownership server-side
- no private vendor credentials in client code
- normalized response objects
- explicit null/error behavior
- idempotency keys for mutations
- re-read authoritative source after mutations before returning success
- response freshness timestamps for operational state
- feature flags may suppress unsupported actions
- safe degradation: content failure should not break subscription/order utility

## Standard response envelope

```json
{
  "data": {},
  "meta": {
    "request_id": "req_123",
    "generated_at": "2026-09-15T21:00:00Z",
    "schema_version": "1.0"
  },
  "errors": []
}
```

## Standard error

```json
{
  "code": "SUBSCRIPTION_MUTATION_FAILED",
  "message": "We couldn't update your next shipment. Your current plan has not changed.",
  "retryable": true,
  "support_reference": "req_123"
}
```

Do not expose vendor stack traces or internal IDs unnecessarily.

## 1. `GET /api/v1/me`

Purpose: authenticated identity + minimal profile.

Response:

```json
{
  "dose_customer_id": "dc_123",
  "first_name": "Alex",
  "identity_status": "resolved",
  "first_login_completed": true,
  "locale": "en-US",
  "timezone": "America/New_York"
}
```

## 2. `GET /api/v1/home`

Purpose: one aggregate request for the Today experience.

Response modules:

```json
{
  "member": {"first_name":"Alex","lifecycle_day":43,"lifecycle_month":2},
  "primary_action": {
    "type":"check_in",
    "title":"Complete your Month 2 check-in",
    "cta":"Check in",
    "reason_code":"m2_checkin_due"
  },
  "routine": {
    "today_status":"not_logged",
    "current_streak":6,
    "adherence_30d":0.82
  },
  "expectation": {
    "milestone_id":"m2_build_consistency",
    "title":"Keep building consistency",
    "body":"..."
  },
  "education": {
    "program_id":"liver_m1_v1",
    "next_module_id":"liver_m1_day_2",
    "progress":0.33
  },
  "order": {
    "order_id":"...",
    "status":"in_transit",
    "estimated_delivery":"2026-10-02"
  },
  "subscription": {
    "status":"active",
    "next_bill_at":"2026-09-28T00:00:00Z"
  },
  "support": {"needs_support":false},
  "recommendation": null
}
```

Priority rules:
1. safety/support issue
2. payment/order/subscription issue
3. due check-in
4. daily routine
5. expectation/education
6. reward
7. recommendation/commerce

## 3. Routine

### `POST /api/v1/routine/log`

Request:

```json
{
  "local_date":"2026-09-15",
  "status":"taken",
  "client_timestamp":"2026-09-15T12:42:00-04:00"
}
```

Allowed status: `taken | later | skipped`.

Response returns canonical day state, current streak and adherence.

### `PUT /api/v1/routine/reminder`

```json
{
  "enabled":true,
  "local_time":"08:00",
  "timezone":"America/New_York"
}
```

## 4. Journey / expectations

### `GET /api/v1/journey`

Returns:
- current lifecycle phase
- milestones
- current milestone
- approved expectation copy
- product-specific content references
- required disclaimer references

The API returns copy/content IDs from governed configuration; client should not encode medical/claim logic.

## 5. Check-ins

### `GET /api/v1/check-ins/current`
Returns current due/available check-in, schema version and questions.

### `POST /api/v1/check-ins/:id/answers`
Supports incremental answer persistence.

### `POST /api/v1/check-ins/:id/complete`
Finalizes check-in and returns normalized outcomes:

```json
{
  "status":"completed",
  "needs_support":true,
  "next_best_action":"book_concierge"
}
```

## 6. Education

### `GET /api/v1/education/programs`
Returns eligible native programs.

### `GET /api/v1/education/programs/:programId`
Returns modules and state: locked/available/started/completed.

### `POST /api/v1/education/modules/:moduleId/start`
### `POST /api/v1/education/modules/:moduleId/complete`

Completion must be idempotent.

## 7. Orders

### `GET /api/v1/orders`
Normalized Shopify order list.

### `GET /api/v1/orders/:orderId`
Includes fulfillment/tracking:

```json
{
  "order_id":"...",
  "placed_at":"...",
  "items":[],
  "status":"in_transit",
  "tracking":{
    "carrier":"UPS",
    "tracking_number_masked":"...1234",
    "estimated_delivery":"2026-10-02",
    "latest_event":"Departed facility",
    "events":[]
  }
}
```

Authorization must confirm order belongs to authenticated `dose_customer_id`.

## 8. Subscription

### `GET /api/v1/subscription`
Returns normalized active subscription state and supported actions.

```json
{
  "status":"active",
  "product":"liver",
  "quantity":1,
  "cadence_days":24,
  "next_bill_at":"...",
  "supported_actions":["skip","change_date","change_quantity"]
}
```

### `POST /api/v1/subscription/skip`
Headers: `Idempotency-Key` required.

Flow:
1. authorize
2. load current Skio state
3. validate skip allowed
4. execute mutation
5. re-read Skio
6. emit event
7. return confirmed new state

### `POST /api/v1/subscription/change-date`
Request: `new_date`.

### `POST /api/v1/subscription/change-quantity`
Request: `quantity`.

### `POST /api/v1/subscription/add-product`
Only when integration/business rules support safe add-on behavior.

## 9. Services

### `GET /api/v1/services`
Returns eligible concierge/nutritionist services with booking state.

```json
{
  "services":[{
    "id":"nutritionist",
    "eligible":true,
    "price":0,
    "duration_minutes":30,
    "status":"not_booked",
    "booking_url":"..."
  }]
}
```

Do not proxy/store clinical notes in V1.

## 10. Recommendations / Discover

### `GET /api/v1/recommendations?slot=home_cross_sell`

Response:

```json
{
  "recommendation_id":"rec_123",
  "slot":"home_cross_sell",
  "product_id":"cholesterol",
  "reason_code":"complements_current_routine",
  "offer":{"type":"subscriber_add_on","display_price":"$63"},
  "explanation":"Pairs with your current Liver routine",
  "rule_version":"cross_sell_v3"
}
```

Null response is valid when suppressed/ineligible.

### `POST /api/v1/recommendations/:id/impression`
Server or client event path, depending instrumentation architecture.

## 11. Rewards / referral

### `GET /api/v1/rewards`
Normalized status from loyalty/referral systems.

### `POST /api/v1/rewards/:benefitId/redeem`
Only if underlying platform supports server-side verified redemption.

## 12. Preferences

### `GET /api/v1/preferences`
### `PUT /api/v1/preferences`

Includes non-sensitive app preferences:
- reminder
- content interests
- service preferences
- push preferences

Sensitive wellness preferences require consent flags and stricter handling.

## 13. Admin/config endpoints

Not exposed to consumers.

Minimum internal capabilities:
- content publish/unpublish
- milestone copy/config
- recommendation rules
- eligibility/suppression rules
- feature flags
- experiment configuration
- audit history

Admin auth requires RBAC and audit logging.

## 14. Webhook/integration ingestion

Server-side webhook handlers should exist for relevant upstream changes:
- Shopify order/fulfillment
- Skio subscription/renewal/cancel/payment state
- loyalty/reward state where supported
- booking completion where supported

Requirements:
- signature verification
- replay/idempotency handling
- dead-letter/retry visibility
- timestamps/source event IDs

## 15. Cache policy

Safe-to-cache:
- published education/content
- design/content config
- static product metadata

Short/read-through cache:
- aggregate Home state where freshness risk is acceptable

Do not return stale cached state after a subscription mutation. Invalidate/re-read.

## 16. Observability

Every request should emit:
- request ID
- route
- latency
- authenticated/anonymous state
- adapter calls and latency
- success/error code
- no unnecessary PII in logs

Dashboards/alerts should identify spikes in:
- identity failures
- Shopify errors
- Skio errors
- mutation failures
- event-delivery failures
- home aggregate latency

## 17. Contract testing

Each vendor adapter should have fixture-based contract tests. Client tests should mock Dose API contracts, not raw vendor responses.

Breaking API changes require versioning or coordinated migration.