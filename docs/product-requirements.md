# V1 Product Requirements

## Goal

Build a subscriber-first experience that makes the next best customer action obvious while reducing avoidable friction around usage, progress, and subscription management.

## V1 navigation

- Home
- Progress
- My Plan
- Rewards
- Learn
- Account

## Home

The Home experience should answer "what matters today?"

Required modules:
- personalized greeting
- current lifecycle day / milestone
- today's Dose action
- weekly consistency indicator
- upcoming shipment and billing summary
- next best action
- progress checkpoint
- member / reward status

## Progress

Required capabilities:
- lifecycle timeline
- checkpoints around Day 1, 14, 30, 45, 60, and 90
- customer-reported progress
- expectation education
- optional objective measurement hooks for future bloodwork / health-marker integrations

## My Plan

Required capabilities:
- current product
- current plan / quantity
- next charge date
- next shipment date
- skip
- pause
- change date
- change frequency
- future product swap

## Rewards

Required capabilities:
- current milestone
- available reward
- redeemed reward history
- surprise-and-delight state
- future referral / review benefits

## Learn

V1 should not behave like an unfiltered content library.

Content is ranked using:
- product
- tenure
- stated goal
- progress state
- adherence state
- subscription risk

## Customer states

Primary relationship state:
- new subscriber
- active subscriber
- paused subscriber
- cancelled subscriber
- one-time purchaser

Secondary overlays:
- adherence state
- progress confidence
- inventory / cadence risk
- billing risk
- engagement state
- product ownership

## V1 exclusions

Do not build in V1:
- full commerce storefront
- custom subscription engine
- custom payment infrastructure
- native social network
- AI medical advice
- full telehealth platform
- complex points economy
- giant editorial library

## Success metrics

Primary:
- app onboarding completion
- first rebill
- second rebill
- active subscription retention
- successful self-service subscription actions

Secondary:
- weekly active usage
- progress check completion
- adherence logging
- reward engagement
- cross-sell interaction
- support deflection

Guardrails:
- cancellation
- skip / pause abuse
- support escalation
- customer confusion
- notification fatigue
