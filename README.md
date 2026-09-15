# Dose Customer App

A subscriber-first digital experience concept for Dose.

The goal is to make lifecycle feel like a product, not a sequence of messages.

## Current Direction

V0 is a mobile-first web app / PWA designed to prove the customer experience before production integrations become a dependency.

The initial demo uses simulated customer states and interactive UI. Missing Shopify, Skio, loyalty, or other write integrations should not block the demo. Production connections will be introduced in V1/V1.5 after the experience is validated.

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
- Account / Support

The experience is intended to respond to customer state, product ownership, tenure, adherence, subscription status, and progress confidence.

## V0 Demo

Initial demo capabilities:

- Mobile-first My Dose home
- Three simulated lifecycle states: Month 1 active, Month 2 at risk, Month 4 engaged
- Interactive daily habit completion
- Journey progress
- Subscription-management concept
- Recommended education
- PWA manifest for an app-like mobile experience

## Stack

- Next.js / React
- GitHub source control
- Vercel planned for preview and stable demo hosting
- Mock data in V0
- Production APIs and analytics integrations as fast follows

## Environments

1. Local — development
2. Preview — QA individual changes
3. Demo — stable stakeholder experience
4. Production Pilot — controlled customer experiment

## Documentation

See [`docs/V0-DEMO-PLAN.md`](docs/V0-DEMO-PLAN.md) for scope, architecture principles, roadmap, production testing strategy, and build priorities.

## Status

**V0 build started September 15, 2026.** Initial application shell and Home / Today experience are now in the repository. Next milestone is deployment to Vercel followed by expansion of the remaining V0 surfaces.