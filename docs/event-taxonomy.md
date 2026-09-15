# Event Taxonomy

## Goal

Create a clean event contract so product behavior can be measured consistently across the app, warehouse, messaging tools, and subscription systems.

## Identity

Every event should include when available:
- customer_id
- email
- subscription_id
- product
- plan
- relationship_state
- occurred_at

## App events

### app_opened
Properties:
- source
- relationship_state
- lifecycle_day

### home_viewed
Properties:
- modules_rendered
- next_best_action

### dose_logged
Properties:
- lifecycle_day
- adherence_state_before
- adherence_state_after

### progress_check_started
Properties:
- checkpoint_day

### progress_check_completed
Properties:
- checkpoint_day
- confidence
- routine_status
- inventory_status

### subscription_management_opened
Properties:
- next_charge_date
- next_shipment_date

### subscription_action_started
Properties:
- action_type
- current_frequency
- current_quantity

### subscription_action_completed
Properties:
- action_type
- prior_value
- new_value

### reward_viewed
Properties:
- reward_type
- milestone

### reward_redeemed
Properties:
- reward_type
- milestone

### content_viewed
Properties:
- content_id
- content_type
- recommendation_reason

### offer_clicked
Properties:
- offer_id
- product
- placement
- recommendation_reason

### support_requested
Properties:
- reason
- source_screen

## Funnel definitions

Do not reuse one event to represent multiple stages.

Example:

**home_viewed → progress_check_started → progress_check_completed → subscription_action_started → subscription_action_completed**

Each stage should remain distinct so the team can reconstruct the real customer journey.

## Source-of-truth rule

- App owns interaction events.
- Subscription platform owns successful subscription-state changes.
- Commerce platform owns completed orders.
- Customer data model owns derived relationship state.

The app should never infer a completed downstream action from a click alone.
