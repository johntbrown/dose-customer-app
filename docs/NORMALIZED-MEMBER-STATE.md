# Normalized Member State V0.1

## Purpose

Create one app-facing state contract so UI components do not derive business logic directly from Shopify, Skio, Klaviyo, TAPP, loyalty, or analytics payloads.

The pilot UI consumes normalized state. Production adapters can later replace demo fixtures without requiring screen rewrites.

## Principle

```text
Vendor/source payloads
  ↓
Adapters + identity resolution
  ↓
Normalized member state
  ↓
Rules / next-best action
  ↓
UI
```

The UI should not need to know whether a field came from Shopify, Skio, warehouse state, TAPP, or another upstream system.

## Current prototype implementation

- `app/lib/memberState.js`
  - centralized demo fixtures
  - normalized state shape
  - four scenarios: Month 1 active, Month 2 at risk, Month 4 engaged, payment failed
- `app/lib/homePriority.js`
  - deterministic Home decision engine
  - outputs one primary action, up to four supporting modules, suppression list, and rule version
- `app/pilot/page.js`
  - proof route demonstrating normalized state → rules → UI

## State domains

### Identity

```text
dose_customer_id
first_name
demo
scenario
```

### Product

```text
primary_product
owned_products[]
```

### Lifecycle

```text
day
month
cycle
current_milestone
```

### Routine

```text
today_status: not_logged | taken | later | skipped
streak_days
```

### Check-in

```text
due
 type
```

### Subscription

```text
status
quantity
cadence_days
payment_status
next_bill_at
next_ship_at
```

### Order

```text
status
shipment_exception
eta_label
```

### Support / services

```text
needs_support
support_reason_category
concierge_eligible
nutritionist_eligible
```

### Education

```text
next_module
completed_modules
total_modules
```

### Loyalty / challenges

```text
points
reward_available
challenge_state
```

### Recommendation

```text
eligible
target
suppression_reason
```

## Home rules output

```text
primary_action_id
primary_action_reason
primary_action_priority
primary_action_cta
primary_action_target
primary_module_id
supporting_module_ids[]
suppressed_module_ids[]
rule_version
```

## Production adapter mapping

Initial ownership remains:

- Shopify → customer/order/commerce reads
- Skio → subscription reads + approved mutations
- app datastore / normalized state service → routine, preferences, check-in state, rule state
- TAPP / migration layer → interim education/check-in data where still required
- loyalty system → reward ledger/state
- warehouse → durable governed history and business outcomes

Adapters should convert upstream responses to this normalized contract before state reaches React screens.

## Required next work

1. Define exact API/BFF JSON schema and nullability.
2. Add source timestamp / freshness metadata for integrated state.
3. Add error/partial-data status per domain.
4. Add eligibility reason codes rather than booleans where operationally useful.
5. Add experiment assignments and feature flags.
6. Replace demo route state with BFF payload in Phase 1.
7. Unit test all Home priority scenarios before any production mutation flow.

## Guardrail

The rules layer is deterministic in V1. AI should not independently choose payment, subscription, support, or health-related actions. AI may later assist with approved content discovery or copy variation behind governed eligibility rules.
