# Dose Customer App

A subscriber-first digital experience concept for Dose.

The goal is to make lifecycle feel like a product, not a sequence of messages.

## Product Thesis

The Dose app should help every customer answer six questions quickly:

1. What should I do today?
2. Am I using Dose correctly?
3. What progress should I expect?
4. When is my next order?
5. How do I manage my subscription?
6. What have I earned or unlocked?

## Core Experience

- Home / Today
- Progress
- My Plan
- Rewards
- Learn
- Account

The experience is driven by customer state, product ownership, tenure, adherence, subscription status, and progress confidence.

## Current Status

V1 product foundation and working prototype are being built now.

### My Plan architecture

My Plan is an experience and orchestration layer over the existing Dose stack. Shopify provides customer and order context. Skio remains the source of truth for subscription state. RudderStack carries app interaction events. BigQuery / Customer 360 owns durable lifecycle and risk state. Klaviyo and Postscript remain activation channels, while Gorgias / CX remains the support layer.

The current prototype now includes:

- `lib/planGateway.ts` for plan-state access
- `lib/stackAdapters.ts` for identity and event contracts
- `lib/planOrchestrator.ts` for app-level plan orchestration
- `app/my-plan/page.tsx` wired to the orchestration layer
- `docs/my-plan-product-spec.md` for product and stack requirements

The next engineering step is replacing the mock gateway with an authenticated Skio adapter and adding supported mutation flows that re-read Skio state before the UI confirms a change.
