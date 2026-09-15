# My Dose Event Taxonomy

## Purpose

Define a stable event contract so app behavior can power Mixpanel product analysis, Klaviyo lifecycle activation, warehouse retention analysis, experiments and support without trapping data inside the client.

## Principles

- RudderStack is the primary event transport/routing layer.
- Use `lower_snake_case` event names.
- Events represent things that happened; profile properties represent durable current state.
- All authenticated events carry `dose_customer_id`.
- Do not include unnecessary PII or sensitive health values.
- Every event has an owner, schema version and documented trigger.
- Event names are behavior-oriented, not UI-copy-oriented, so copy can change without breaking analytics.
- Experiment exposures are first-class events.

## Common event properties

Every authenticated event should include when applicable:

```text
event_id
schema_version
event_timestamp
dose_customer_id
shopify_customer_id
skio_customer_id
session_id
anonymous_id
platform
app_version
environment
lifecycle_day
lifecycle_month
subscription_cycle
subscription_status
primary_product
owned_products
experiment_assignments
source_screen
```

Do not send email/phone in ordinary analytics event payloads unless a destination specifically requires and policy permits it.

## 1. App/session

### `app_opened`
Trigger: authenticated app/session open.

Properties:
- entry_source: direct | email | sms | push | web
- deep_link_target
- returning_user

### `screen_viewed`
Properties:
- screen_name
- previous_screen
- navigation_method

### `first_login_started`
### `first_login_completed`
### `splash_viewed`
### `splash_completed`

Use to measure activation and first-login drop-off.

## 2. Routine

### `routine_action_logged`
Properties:
- status: taken | later | skipped
- local_date
- previous_status
- reminder_enabled

### `reminder_set`
Properties:
- local_time_bucket
- timezone

### `reminder_updated`
### `reminder_disabled`

### `streak_achieved`
Properties:
- streak_days
- milestone_type

Do not fire `streak_achieved` on every app open; only when a new milestone is actually reached.

## 3. Check-ins

### `check_in_viewed`
### `check_in_started`
### `check_in_question_answered`
Properties:
- check_in_type: m1 | m2 | m3 | ad_hoc
- question_id
- answer_category (avoid raw sensitive free text)

### `check_in_completed`
Properties:
- check_in_type
- needs_support
- next_best_action
- completion_seconds

### `support_need_detected`
Properties:
- source: check_in | support_request | other
- reason_category

## 4. Education/content

### `education_program_viewed`
Properties:
- program_id
- program_version

### `education_module_started`
### `education_module_completed`
Properties:
- program_id
- module_id
- module_type
- product_context
- lifecycle_context

### `article_viewed`
### `guide_viewed`
### `recipe_opened`
### `community_clicked`

## 5. Journey / expectations

### `journey_viewed`
### `milestone_viewed`
Properties:
- milestone_id
- milestone_month
- current_member_month

### `results_expectation_cta_clicked`
Properties:
- target_type: education | check_in | service | lab_info

## 6. Orders

### `orders_viewed`
### `order_tracking_viewed`
Properties:
- order_id_hash_or_internal_safe_id
- normalized_order_status
- carrier_category

### `tracking_detail_expanded`
### `order_issue_report_started`

Do not use full tracking number as an analytics property unless explicitly required.

## 7. Subscription

### `subscription_viewed`
Properties:
- subscription_status
- cycle
- cadence_days
- quantity

### `subscription_change_started`
Properties:
- action: skip | change_date | change_quantity | add_product | cancel_entry
- eligibility_state

### `subscription_change_completed`
Properties:
- action
- success: true
- resulting_state
- request_id

### `subscription_change_failed`
Properties:
- action
- error_code
- retryable

Never emit a success event before the authoritative Skio re-read confirms the change.

## 8. Services

### `service_viewed`
Properties:
- service_id: concierge | nutritionist
- eligibility
- current_status

### `service_booking_started`
### `service_booking_completed`
Properties:
- service_id
- booking_source

### `support_channel_clicked`
Properties:
- channel: chat | phone | sms | email | faq

## 9. Recommendations / commerce

### `recommendation_viewed`
Properties:
- recommendation_id
- slot
- product_id
- reason_code
- rule_version
- offer_type

### `recommendation_clicked`
### `recommendation_added`
### `recommendation_purchase_completed`

This sequence enables impression → click → add → purchase measurement.

### `product_viewed`
### `add_to_cart`
### `checkout_started`
### `purchase_completed`

Commerce events should align with existing ecommerce event conventions where possible to avoid duplicate definitions.

## 10. Rewards/referral

### `reward_viewed`
### `reward_redeemed`
Properties:
- reward_id
- milestone_id
- reward_type

### `referral_started`
### `referral_shared`

## 11. Profile/preferences

### `goal_selected`
### `preference_updated`
### `bloodwork_interest_updated`

For potentially sensitive inputs, emit categorical state only when approved. Avoid raw health values in general analytics destinations.

## 12. Experimentation

### `experiment_exposed`
Required properties:
- experiment_id
- variant
- assignment_version
- exposure_surface
- eligibility_snapshot_id or reason code

Fire once per meaningful exposure, not merely on assignment creation if the member never sees the treatment.

### `experiment_conversion`
Usually derived downstream from canonical outcome events rather than custom event names.

## 13. Error/operational analytics

Operational monitoring should be separated from customer-product analytics when possible.

Useful events/log metrics:
- identity_resolution_failed
- integration_request_failed
- webhook_processing_failed
- event_delivery_failed
- content_config_failed
- recommendation_rule_failed

These belong primarily in engineering observability, not business product dashboards.

## 14. Profile properties for Klaviyo / downstream activation

Durable properties can include:

```text
dose_app_activated
dose_app_last_active_at
dose_primary_product
dose_owned_products
dose_is_active_subscriber
dose_subscription_cycle
dose_lifecycle_stage
dose_needs_support
dose_cross_sell_target
dose_review_eligible
dose_commitment_status
dose_last_check_in_type
dose_last_check_in_at
dose_reminder_enabled
```

Do not push high-volume daily log history as profile properties.

## 15. Event QA checklist

For every new event:
- [ ] trigger is precise
- [ ] name is stable and behavior-based
- [ ] required properties documented
- [ ] data types documented
- [ ] enum values bounded
- [ ] PII/sensitive-data review passed
- [ ] duplicate firing tested
- [ ] retry/idempotency behavior understood
- [ ] visible in RudderStack
- [ ] reaches intended destinations
- [ ] Mixpanel property typing verified
- [ ] warehouse record verified
- [ ] Klaviyo use documented if applicable

## 16. Measurement ownership

- Mixpanel: product funnels, feature adoption, behavioral cohorts
- Klaviyo: lifecycle activation triggered by app state/events
- Warehouse/BI: official retention, LTV, subscription survival, incremental commerce and experiment outcomes

Do not declare a business outcome from Mixpanel alone when a governed warehouse definition exists.