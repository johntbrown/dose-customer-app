# My Dose V0.9 — Backend Architecture

## Executive summary
My Dose should be an **experience and orchestration layer over the systems Dose already uses**, not a new system of record.

The app should read from a governed customer-state layer, write approved actions back to the systems that own them, emit structured events through the existing event stack, and rely on the warehouse for durable history and official reporting.

## Core architecture principle

**App UI → App API / BFF → Customer State + Domain Services → Existing Systems of Record**

The app should never duplicate business-critical ownership that already exists in Shopify, Skio, Klaviyo, or the warehouse.

### System ownership
| Domain | System of record / role |
| --- | --- |
| Commerce, customer, orders | Shopify |
| Subscription state + approved subscription mutations | Skio |
| Lifecycle activation, email/SMS, profile properties | Klaviyo |
| Event routing / identity-aware transport | RudderStack |
| Behavioral product analytics | Mixpanel |
| Durable history, official retention/LTV definitions | Warehouse / BI |
| Interim education/check-ins/zero-party data | TAPP |
| Reviews/social proof | Okendo |
| Rewards / milestone benefits | Existing or selected loyalty system; do not build a custom rewards ledger in V1 |

## Recommended backend shape

### 1. App API / Backend-for-Frontend
Create a thin server-side API layer that powers the mobile/web app.

Responsibilities:
- authenticate the member
- resolve the canonical Dose customer
- aggregate data from Shopify, Skio, content, tracking, rewards, and customer-state sources
- return app-ready payloads rather than exposing vendor APIs directly to the client
- execute approved mutations through server-side integrations
- enforce authorization and consent
- emit analytics events
- cache non-sensitive content where useful

Recommended endpoint families:

```text
/api/me
/api/home
/api/journey
/api/education
/api/orders
/api/orders/:id
/api/subscription
/api/subscription/skip
/api/subscription/change-date
/api/discover
/api/recommendations
/api/rewards
/api/services
/api/preferences
/api/events
```

The client should not need to know whether a value came from Shopify, Skio, the warehouse, or TAPP.

## 2. Canonical identity layer
Every app session should resolve to one canonical `dose_customer_id`.

Identity map should maintain:
- `dose_customer_id`
- Shopify customer ID
- Skio customer/subscription ID(s)
- Klaviyo profile ID
- RudderStack anonymous/user IDs where applicable
- email
- phone, when consented
- app user/auth ID

Rules:
- Never key business logic only on email.
- Identity resolution should happen server-side.
- Merge/duplicate handling should follow Shopify/customer-data governance rather than creating parallel customer records in the app.
- RudderStack events should identify the same canonical customer once known.

## 3. Customer State Service
The app needs one normalized customer-state object so every screen uses consistent logic.

Suggested shape:

```json
{
  "dose_customer_id": "...",
  "lifecycle": {
    "customer_type": "subscriber",
    "month": 2,
    "day": 43,
    "risk_state": "at_risk"
  },
  "subscription": {
    "status": "active",
    "product": "Dose for your Liver",
    "quantity": 1,
    "cadence_days": 24,
    "next_bill_date": "2026-09-28",
    "next_ship_date": "2026-09-29",
    "order_count": 3
  },
  "engagement": {
    "daily_streak": 6,
    "adherence_30d": 82,
    "education_completed": 1
  },
  "goals": [],
  "routine": {},
  "progress": {},
  "rewards": {},
  "preferences": {}
}
```

### Sources
- subscription fields: Skio
- order/customer fields: Shopify
- engagement and education: app events + TAPP during migration
- goals/preferences/ZPD: TAPP / forms / app inputs
- official derived lifecycle fields: governed transformation layer / warehouse logic where appropriate

The app can cache this object for fast reads, but should not become the authoritative owner of upstream subscription or commerce fields.

## 4. Authentication and session model
Recommended production path:
- passwordless email magic link or OTP
- authenticated session mapped to `dose_customer_id`
- server-side token/session store
- short-lived session tokens with secure refresh
- no vendor credentials in the browser

For first login:
1. authenticate
2. resolve Shopify customer
3. resolve Skio subscription
4. create/link `dose_customer_id`
5. fetch customer-state
6. determine whether splash/onboarding has been seen
7. render personalized app home

Persist app-specific flags such as:
- `first_login_completed`
- `splash_seen_at`
- `onboarding_completed_at`
- notification preferences
- education completion if not owned elsewhere

## 5. Home / portal aggregation
The `GET /api/home` response should assemble the key portal modules in one request:
- greeting / lifecycle month
- today's action
- next expectation milestone
- current education program
- active order / tracking summary
- subscription summary
- available member services
- rewards/benefits summary
- recommendation / cross-sell slot

This keeps the app fast and prevents the client from making 6–10 vendor calls on initial load.

## 6. Subscription management
Skio remains authoritative for subscription state and mutations.

Read actions:
- active subscriptions
- products
- quantity
- cadence
- next bill date
- next order
- status

Write actions:
- skip next shipment
- change next charge/date
- quantity changes
- product swap/add-on, if supported
- cancellation entry point / save flow

Rules:
- App calls server-side Dose API.
- Dose API validates customer ownership and business rules.
- Dose API calls Skio.
- Mutation result is re-read before UI confirmation.
- Event is emitted through RudderStack.
- Klaviyo profile/event state is updated as needed.

Do not build an independent subscription engine.

## 7. Orders and tracking
Shopify should remain the primary commerce/order record.

Normalized order object:

```json
{
  "order_id": "...",
  "status": "in_transit",
  "placed_at": "...",
  "items": [],
  "tracking": {
    "carrier": "...",
    "tracking_number": "...",
    "estimated_delivery": "...",
    "latest_event": "...",
    "events": []
  }
}
```

Tracking can be populated from the fulfillment/carrier source connected to Shopify. The app should normalize carrier-specific events into a simple state model:

`confirmed → shipped → in_transit → out_for_delivery → delivered → exception`

The current prototype should be treated as mock data until the exact fulfillment/tracking API is confirmed.

## 8. Education and TAPP migration
TAPP is currently an education/check-in/zero-party-data source, but the app should progressively absorb that experience.

Recommended model:

```text
program
  id
  product
  lifecycle_stage
  title
  modules[]

module
  id
  type
  title
  content
  unlock_rule
  completion_rule
  analytics_tags
```

Supported module types can include:
- article
- video
- quiz
- check-in
- routine builder
- milestone
- product education
- CTA

During migration:
- reuse TAPP-derived product/lifecycle logic where needed
- write new native app completion events to the event stack
- backfill/normalize TAPP history when feasible
- do not hard-code product variants into UI components

## 9. Journey / expectation engine
The app needs a rules-driven experience for "what should this customer expect now?"

Inputs:
- product
- lifecycle month/day
- subscription state
- adherence / engagement
- completed education
- optional goals/ZPD

Outputs:
- current milestone
- next milestone
- expectation copy
- recommended education
- check-in prompt
- relevant support/service CTA

V1 should be deterministic rules, not ML.

Example:

```text
IF product = liver
AND lifecycle_month = 1
THEN milestone = build_habit
AND next_content = liver_masterclass_day_2
```

This logic should live server-side or in a governed configuration layer, not inside React components.

## 10. Recommendations / upsell / cross-sell
The Discover experience should be powered by a recommendation service with explicit eligibility rules.

Inputs:
- owned products
- subscription status
- lifecycle stage
- health goals / ZPD
- prior purchases
- campaign eligibility
- inventory / merchandising eligibility

Output:

```json
{
  "slot": "home_cross_sell",
  "product_id": "cholesterol",
  "reason": "complements_current_routine",
  "offer": {
    "type": "subscriber_add_on",
    "price": 63
  }
}
```

V1 recommendation logic should be rules/config driven and measurable. Do not hard-code "Liver → Cholesterol" into the front end.

Every impression and action should emit:
- `recommendation_viewed`
- `recommendation_clicked`
- `recommendation_added`
- `recommendation_purchased`

## 11. Services / concierge / nutritionist
The portal design includes concierge and nutritionist services.

Backend needs:
- eligibility
- booking URL/provider ID
- booked/not booked state
- completed state if available
- benefit value / pricing display

Do not store clinical notes in the consumer app backend unless there is a separate approved health-data architecture and compliance review.

## 12. Rewards / milestone benefits
App should display rewards and milestone progress, but V1 should avoid creating a custom loyalty economy.

Normalized read model:
- points/status, if applicable
- upcoming milestone
- available gift/credit
- redemption eligibility
- referral status

Write actions should route to the selected rewards/referral system.

## 13. Klaviyo integration
Klaviyo remains the lifecycle activation layer.

The app should send meaningful events/profile updates such as:
- app first login
- splash completed
- education started/completed
- milestone viewed
- daily check-in
- concierge clicked/booked
- nutritionist clicked/booked
- subscription action
- order tracking viewed
- recommendation viewed/clicked/added
- referral clicked
- rewards viewed

Klaviyo should use these events for email/SMS orchestration, but should not be treated as the source of truth for subscription or order state.

## 14. RudderStack event contract
All meaningful app behavior should emit structured events through RudderStack.

Every event should include, when available:

```text
dose_customer_id
shopify_customer_id
skio_customer_id
session_id
platform
app_version
lifecycle_month
subscription_status
primary_product
event_timestamp
```

Event names should be stable, lower_snake_case, and governed in a schema registry/data dictionary.

Recommended core taxonomy:

```text
app_opened
first_login_completed
home_viewed
daily_dose_checked_in
journey_viewed
milestone_viewed
education_program_viewed
education_module_started
education_module_completed
order_tracking_viewed
subscription_viewed
subscription_change_started
subscription_change_completed
recommendation_viewed
recommendation_clicked
recommendation_added
service_viewed
service_booking_started
reward_viewed
referral_started
```

## 15. Mixpanel
Mixpanel is the product-behavior analysis layer, not the business source of truth.

Use it for:
- funnel analysis
- feature adoption
- education completion
- repeat app usage
- journey engagement
- order-tracking engagement
- subscription-action funnels
- cross-sell conversion paths
- cohorting by lifecycle/customer state

Official company counts for retention, LTV, orders, churn, and financial outcomes should come from governed warehouse definitions.

## 16. Warehouse / BI
Warehouse should retain durable cross-system history for:
- customer identity mapping
- subscription history
- orders
- lifecycle transitions
- churn/cancel/save outcomes
- app event history
- education engagement
- cross-sell exposure/conversion
- experiment assignments
- LTV / retention reporting

The app backend can consume derived attributes from the warehouse when latency allows, but real-time operational state should come from operational systems.

## 17. Suggested app-owned datastore
The app likely needs a small first-party database for app-specific state only.

Recommended entities:

```text
app_users
customer_identity_map
app_preferences
onboarding_state
education_progress
check_ins
app_feature_flags
recommendation_exposures
service_state
experiment_assignments
```

Do **not** copy the full Shopify/Skio customer model into this database.

## 18. API response principles
- return normalized app objects, not raw vendor payloads
- version critical APIs
- use idempotency keys for mutations
- return mutation state only after source-system confirmation
- distinguish operational state from analytics/derived state
- include timestamps / freshness metadata for important fields
- gracefully degrade non-critical modules if one vendor is unavailable

## 19. Security and privacy
Minimum production requirements:
- secrets stored server-side only
- encrypted transport and storage
- least-privilege vendor credentials
- auditable mutations
- customer authorization on every customer-scoped route
- consent-aware Klaviyo/SMS behavior
- PII excluded from client logs and analytics where unnecessary
- health-related inputs handled conservatively and reviewed before expanding scope

## 20. Recommended production services
Logical services, even if initially implemented in one Next.js backend:

```text
Auth Service
Customer Identity Service
Customer State Service
Subscription Service
Order Service
Education Service
Journey Service
Recommendation Service
Rewards Service
Service/Booking Service
Event Service
Content/Config Service
```

V1 can be a modular monolith. Do not start with microservices.

## 21. Data flow examples

### App login
```text
User → Auth → Identity resolution → Shopify + Skio lookup → Customer State → Home payload
                                  ↘ RudderStack → Mixpanel/Klaviyo/Warehouse
```

### Skip shipment
```text
App → Dose API → authorize customer → Skio mutation → re-read Skio state → return success
                                              ↘ event → RudderStack → Klaviyo/Mixpanel/Warehouse
```

### Complete education lesson
```text
App → Education API → store completion → update customer state → RudderStack event
                                                        ↘ Mixpanel
                                                        ↘ Klaviyo
                                                        ↘ Warehouse
```

### Cross-sell add-on
```text
App → Recommendation Service → eligibility check → subscription/cart mutation → Skio/Shopify
                ↘ exposure/action events → RudderStack → Mixpanel/Klaviyo/Warehouse
```

## 22. Build phases

### Phase 1 — Demo to authenticated pilot
- authentication
- `dose_customer_id` identity map
- home aggregation endpoint
- real Shopify order read
- real Skio subscription read
- app-specific datastore
- RudderStack event instrumentation
- Mixpanel dashboards
- config-driven education/journey content

### Phase 2 — Member self-service
- skip/change-date subscription actions
- real order tracking
- service booking integrations
- recommendation eligibility
- add-to-next-order action
- native check-ins / education completion
- Klaviyo activation from app events

### Phase 3 — Retention operating system
- loyalty/rewards integration
- richer personalization
- experimentation framework
- warehouse-derived risk/customer states
- health-goal routing
- broader TAPP retirement
- optional biomarker integrations after separate product/compliance scoping

## 23. Open backend decisions
These need confirmation before implementation:
- production auth provider
- exact warehouse technology / query interface
- exact fulfillment/carrier tracking source
- current loyalty/referral system of record
- concierge/nutritionist booking provider
- whether TAPP history can be exported/backfilled at user level
- ownership of the canonical `dose_customer_id`
- latency SLA for warehouse-derived attributes
- approved data retention/privacy rules for check-ins and health-goal inputs

## 24. Non-goals for V1
- custom subscription engine
- custom commerce/order engine
- custom loyalty ledger
- ML recommendation model
- direct client access to Skio/Shopify private APIs
- duplicating the warehouse inside the app database
- storing clinical notes or sensitive health records without separate approval

## Bottom line
My Dose should become the **customer-facing operating layer** across Dose's existing stack: Shopify and Skio own operational truth, RudderStack moves behavior, Klaviyo activates lifecycle communication, Mixpanel explains app behavior, and the warehouse preserves governed history and business truth.

The app backend's job is to make those systems feel like one coherent customer product.