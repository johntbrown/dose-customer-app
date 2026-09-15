# ADR 0002: V1 uses a modular monolith with Backend-for-Frontend

- Status: Accepted for V1 planning
- Date: 2026-09-15

## Context

The app needs clear domains for identity, state, routine, orders, subscriptions, education, services, rewards, recommendations and events. That does not justify independent microservices at current scale.

## Decision

V1 will use one deployable backend/application service with explicit internal domain modules and adapters.

Logical modules:
- auth
- identity
- customer state
- routine
- check-ins
- education/content
- journey/next-best-action
- subscription
- orders/tracking
- services
- rewards/referral
- recommendations
- events
- config/feature flags

The client communicates with a Dose-owned BFF contract rather than vendor APIs.

## Consequences

Positive:
- lower operational complexity
- faster cross-domain iteration
- one observability/release surface
- clear seams for future extraction if required

Tradeoffs:
- module boundaries must be enforced by code review/conventions
- large codebase can become coupled if adapters/domain logic leak into UI

## Extraction trigger

Consider separate services only when a domain has materially different scaling, security, ownership or deployment needs, not simply because it is conceptually separate.