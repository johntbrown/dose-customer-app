# ADR 0001: My Dose is an experience layer, not a system of record

- Status: Accepted
- Date: 2026-09-15

## Context

Dose already has operational systems for commerce/orders, subscriptions, lifecycle activation, events and durable analytics. Rebuilding those systems inside the app would create duplicate state, reconciliation risk and operational burden.

## Decision

My Dose will orchestrate existing systems through a Dose-owned API/customer-state layer.

Authoritative ownership:
- Shopify: commerce/customers/orders
- Skio: subscriptions
- Klaviyo: lifecycle activation
- RudderStack: event routing
- Warehouse/BI: durable history + official business metrics
- app datastore: app-specific state only

## Consequences

Positive:
- lower state-integrity risk
- simpler vendor replacement behind adapters
- easier analytics reconciliation
- no custom subscription/payment platform

Tradeoffs:
- app reliability depends on upstream systems
- requires well-designed adapters/caching/degraded states
- identity resolution becomes foundational

## Guardrail

No feature may create a parallel authoritative subscription/order/payment state without a new explicit architecture decision.