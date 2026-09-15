# My Dose Gamification & Loyalty V1

## Purpose

Gamification should reinforce the behaviors that make customers more successful with Dose: consistency, education, expectation-setting, feedback, service usage, and retention milestones. It should not turn the app into a noisy points game.

## Product principle

**Reward readiness and consistency, not screen time.**

The reward system should make progress visible and motivate the next useful action while staying consistent with Dose's calm, clinical-warm brand.

## Current prototype implementation

The V0 demo now includes:
- current Dose-taking streak
- 7-day badge progress
- points balance
- illustrative cash-back balance
- badge collection with progress bars
- daily tips
- learn-and-earn lesson rewards
- review reward interaction
- rewards center
- member-portal reward summary

All points, cash-back values, badge thresholds, and redemption economics shown in the prototype are **illustrative** until loyalty economics and system-of-record decisions are approved.

## Core reward loops

### 1. Daily consistency loop
Member takes/logs Dose → streak increases → progress bar moves → badge unlocks → points earned.

Potential actions:
- Taken
- Later
- Skip

Only positive/meaningful completed actions should award points. Missing a day should not create punitive or shaming mechanics.

### 2. Education loop
Member completes product education → points + badge progress → better product readiness.

Examples:
- complete Masterclass lesson
- complete entire program
- view expectation milestone

### 3. Feedback loop
Member becomes review-eligible → writes review → reward/points → Community Voice badge.

Review rewards must follow the approved reviews/Okendo policy and should not be contingent on positive sentiment.

### 4. Milestone loop
Customer reaches meaningful retention milestone → unlocks badge/reward.

Candidate milestones:
- 7 consecutive days
- 24-day cycle completion
- Order 3 / ~D72
- 90-day journey
- 6-month milestone
- 12-month milestone

### 5. Referral / advocacy loop
Eligible customer refers friend → referral benefit shown through existing referral system.

Do not create a separate referral ledger in the app.

## Proposed badge taxonomy

### Habit badges
- 7-Day Starter
- Full Cycle / 24 Days
- 30-Day Consistency
- 90-Day Routine

### Learning badges
- Dose Scholar: complete a product Masterclass
- Science Explorer: complete selected science education

### Progress badges
- First Check-In
- Month 3 Milestone
- Month 6 Milestone
- Year One

### Community badges
- Community Voice: eligible review submitted
- Dose Advocate: referral milestone, if approved

## Points model

V1 should use one normalized reward-balance read model from the selected loyalty system.

Suggested app-facing fields:

```text
points_balance
cashback_available
next_reward_threshold
points_to_next_reward
reward_status
available_rewards[]
completed_badges[]
badge_progress[]
```

The app must not become the authoritative rewards ledger.

## Earning rules

Production earning values must be configurable and owned by the loyalty program, not hard-coded into UI.

Candidate earning actions:
- daily routine completion
- education module completion
- monthly check-in completion
- eligible review
- referral
- retention milestone
- approved challenge / campaign

Avoid rewarding:
- excessive app opens
- unnecessary clicks
- behaviors that could distort customer health/use patterns

## Cash back

Cash-back/credit should be treated as a benefit state, not an invented app currency.

Required fields:
- available balance
- expiration if applicable
- redemption eligibility
- redemption method
- pending/confirmed state

Any final point-to-dollar conversion requires Finance/Retention approval and authoritative system support.

## Badge progress model

```json
{
  "badge_id": "habit_7_day",
  "name": "7-Day Starter",
  "current": 6,
  "target": 7,
  "progress": 0.857,
  "status": "in_progress"
}
```

Statuses:
- locked
- in_progress
- unlocked
- claimed, if claim action is required

## Daily tips

Daily tips should be useful even without rewards.

Content themes:
- habit stacking
- consistency after missed days
- product usage
- order planning
- expectation setting
- education discovery
- member benefits

Tips should be content/config driven and targeted by product/lifecycle stage where useful.

## Reviews

Review surface should consume normalized state:

```text
review_eligible
review_product_target
review_completed_at
review_reward_eligible
```

Rules:
- reward cannot depend on review sentiment
- suppress when not eligible
- use Okendo/existing review platform where applicable
- completion should return confirmed state before points/reward UI updates in production

## Home hierarchy

Gamification should support, not crowd, the core Today screen.

Recommended hierarchy:
1. primary daily/urgent action
2. current streak + next badge
3. one daily tip
4. compact reward snapshot
5. expectations / education / order modules

Do not allow reward modules to outrank support, payment, order, or subscription issues.

## Reward Center

Recommended modules:
- current points
- available cash back/benefit
- next reward progress
- badge collection
- earn-more actions
- milestone history
- referral/advocacy
- terms / expiration where relevant

## Analytics events

Add to the event taxonomy:

```text
rewards_center_viewed
points_balance_viewed
badge_progress_viewed
badge_unlocked
reward_progress_viewed
reward_redeemed
review_reward_started
review_reward_completed
daily_tip_viewed
daily_tip_clicked
```

Existing actions such as `routine_action_logged`, `education_module_completed`, `review_completed`, and `referral_started` should remain the canonical underlying behavior events.

## Experiments

Potential tests:

### Streak visibility
Hypothesis: visible streak + next-badge progress increases 14/30-day routine adherence.

Primary KPI: adherence.
Guardrail: notification opt-out / app disengagement.
Business outcome: D24/D48 survival.

### Learn & earn
Hypothesis: modest points for Masterclass completion increase education completion and customer readiness.

Primary KPI: program completion.
Business outcome: cancellation / retention by exposure cohort.

### Milestone benefit
Hypothesis: purposeful reward around Order 3 / D72 improves D90 survival.

Primary KPI: redemption / engagement.
Business outcome: D90 subscription survival.

## Guardrails

Gamification must not:
- imply guaranteed health outcomes
- reward positive reviews specifically
- punish missed doses
- incentivize taking more than recommended
- hide reward terms or expiration
- create a shadow loyalty ledger
- outrank customer-service or subscription friction
- become a substitute for measuring actual retention/LTV

## Production dependencies

- selected loyalty/rewards system of record
- review/Okendo integration
- routine tracking
- education completion
- canonical identity
- event pipeline
- config/CMS for daily tips and earning rules
- Finance/Retention approval for cash-back economics
- CX support process for reward disputes

## Definition of success

Gamification is successful if it makes good member behaviors more visible and motivating while improving readiness, adherence, retention, or customer value. More points earned is not a success metric by itself.