# My Plan Product Spec

## Goal

My Plan gives a Dose subscriber one clear place to understand and manage their subscription without creating a second source of subscription truth.

## Product principle

The app is an experience layer over the existing Dose stack. Skio continues to own subscription state. Shopify continues to own customer and order context. RudderStack and the warehouse carry behavioral events and durable customer state. Klaviyo and Postscript remain activation channels. Gorgias remains the support layer.

## V1 customer jobs

A subscriber should be able to:

- understand the next order and shipment timing
- skip the next order
- change the next order date
- change cadence where supported
- change quantity where supported
- change product where supported
- understand whether current inventory matches cadence
- start a reason-aware cancellation journey
- recover from a failed billing state through the supported subscription experience
- reach support when an action requires human review

## Source of truth

My Plan must never maintain independent subscription state. All subscription reads and approved actions should resolve against Skio and then refresh from Skio after completion.

## Identity

Use a durable `dose_customer_id` to resolve customer context across Shopify, Skio, Klaviyo, RudderStack, TAPP, Gorgias, and downstream analytics. Email can be a lookup attribute but should not be the primary identity key.

## Inventory fit

My Plan should ask a lightweight inventory question before major renewal moments:

- I am on track
- I have extra Dose left
- I am running low

The response becomes a behavioral signal, not a replacement for subscription state.

Recommended treatments:

- on track: preserve cadence
- extra product: surface skip or slower cadence before discounting
- running low: surface earlier date or quantity adjustment where supported

## Cancellation journey

Cancellation should be a guided decision flow rather than a single destructive action.

1. Capture the customer's reason.
2. Identify whether the issue is cadence, excess inventory, price, product fit, confidence in progress, support need, or another reason.
3. Surface the most relevant operational solution first when appropriate.
4. If the customer still wants to leave, continue into the supported Skio cancellation path.
5. Route health, safety, and approved exception cases to support where required.
6. Preserve commitment-plan rules and exception handling.
7. Record reason, treatment, outcome, product, subscription identifier, lifecycle stage, and origin for analytics.

## Event model

Point-in-time app events should flow through RudderStack, including:

- app_plan_viewed
- app_inventory_fit_selected
- app_plan_action_started
- app_plan_action_completed
- app_cancel_started
- app_cancel_reason_selected
- app_save_option_presented
- app_save_option_accepted
- app_support_handoff_started

Durable state such as subscription status, lifecycle stage, risk state, and commitment eligibility should continue to be calculated upstream in the Customer 360 / warehouse layer.

## Guardrails

- Do not build a custom subscription engine.
- Do not duplicate Skio state locally as authoritative data.
- Do not use Klaviyo events as the source of truth for subscription eligibility.
- Do not immediately offer discounts when a cadence or inventory solution addresses the problem.
- Do not mix support-only cancellation reasons into self-service logic without the required handoff.
- Re-fetch subscription state after any successful change.
