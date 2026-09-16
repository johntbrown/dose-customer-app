# My Dose Gamification & Loyalty V1

## Purpose

Gamification should reinforce the behaviors that make customers more successful with Dose: consistency, education, expectation-setting, feedback, service usage, retention milestones, and long-term engagement. It should not turn the app into a noisy points game.

## Product principle

**Reward readiness and consistency, not screen time.**

The reward system should make progress visible and motivate the next useful action while staying consistent with Dose's calm, clinical-warm brand.

## Current prototype implementation

The demo now includes:
- current Dose-taking streak
- badge progress bars
- points balance
- illustrative cash-back balance
- Bronze / Silver / Gold member levels
- daily tips
- Learn & Earn lesson rewards
- review reward interaction
- milestone gifts, including an Order 3 / D72 travel-case concept
- opt-in-style weekly leaderboard using aliases only
- Apple Watch / Apple Health connection concept with clearly labeled demo data
- Rewards Center
- member-portal reward summary
- increased CTA spacing / breathing room across reward and core action surfaces

All points, cash-back values, level thresholds, leaderboard positions, badge thresholds, gift economics, and redemption rules shown in the prototype are **illustrative** until loyalty economics and system-of-record decisions are approved.

## Core reward loops

### 1. Daily consistency loop
Member takes/logs Dose → streak increases → progress bar moves → badge/level progress advances → points earned.

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

Review rewards must follow the approved reviews/Okendo policy and must never depend on positive sentiment.

### 4. Milestone loop
Customer reaches meaningful retention milestone → unlocks badge + purposeful reward/gift.

Candidate milestones:
- 7 consecutive days
- 24-day cycle completion
- Order 3 / ~D72
- 90-day journey
- 6-month milestone
- 12-month milestone

### 5. Status/level loop
Points and qualified retention behaviors determine a visible member level.

Prototype tiers:
- Bronze
- Silver
- Gold

Production level thresholds should be configurable, not hard-coded.

Levels should primarily provide:
- recognition
- visual progression
- eligibility for member benefits
- milestone motivation

Levels should not imply medical progress or superior health outcomes.

### 6. Community loop
Eligible members may opt into a lightweight leaderboard / Dose Circle experience.

Leaderboard principles:
- opt-in only
- aliases/display names rather than full legal names by default
- clear privacy controls
- no health outcomes or biometrics used for ranking
- rank behavior only on approved engagement/reward signals
- easy opt-out

### 7. Referral / advocacy loop
Eligible customer refers friend → referral benefit shown through existing referral system.

Do not create a separate referral ledger in the app.

## Milestone gift model

The highest-value rewards should be tied to meaningful retention moments, not arbitrary app usage.

Prototype examples:

| Milestone | Prototype reward | Rationale |
| --- | --- | --- |
| First full cycle | 250 bonus points | Reinforce early routine formation |
| Order 3 / ~D72 | Dose Travel Case | Purposeful gift that supports routine while traveling |
| 90-day journey | $10 member credit | Celebrate completion of the first major retention window |

The travel case is especially aligned because it is useful, physical, Dose-branded, and connected to maintaining the habit rather than generic kitchen swag.

Production implementation requires:
- inventory eligibility
- SKU/PDP or gift configuration
- redemption state
- fulfillment ownership
- expiration/while-supplies-last rules
- manual vs automatic application decision
- CX fallback
- experiment assignment and holdout support

## Member levels

Suggested normalized model:

```text
member_level: bronze | silver | gold
member_level_points
next_level
points_to_next_level
level_progress
level_benefits[]
```

Do not calculate production levels independently in the client.

Potential benefit model:
- Bronze: base subscriber benefits
- Silver: additional reward multiplier or early-access benefit
- Gold: premium milestone benefit / priority access

Any economic benefits require Finance/Retention approval.

## Leaderboard / Dose Circle

Recommended fields:

```text
leaderboard_opt_in
leaderboard_alias
leaderboard_score
leaderboard_rank
leaderboard_period
leaderboard_cohort
```

Recommended default leaderboard window: weekly, so progress feels achievable and rankings reset rather than permanently favoring long-tenure members.

Possible score inputs:
- qualifying routine completions
- education completion
- check-in completion
- approved referral/review actions

Do not rank customers by:
- spend alone
- health markers
- lab results
- body metrics
- dosage beyond recommended use

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
member_level
level_progress
milestone_gifts[]
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
- taking more product than recommended

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

## Wearables / Apple Watch concept

Wearables should add **context**, not medical conclusions.

Potential Apple Health signals:
- steps / activity
- sleep duration
- heart rate summaries where approved
- workouts/activity summaries

Use cases:
- show routine alongside broader daily wellness context
- personalize reminder timing or daily tips, only if explicitly approved
- give the member one place to view Dose consistency next to selected wellness signals

Do not use wearable signals in V1 to:
- diagnose
- claim Dose caused a biometric change
- award points for clinically sensitive outcomes
- infer treatment response

The current PWA button is only a product prototype. Production Apple Health access requires a native iOS/watchOS HealthKit-capable app surface and explicit, fine-grained member permission. See `WEARABLES-AND-HEALTHKIT.md`.

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
4. compact reward snapshot / member level
5. expectations / education / order modules

Do not allow reward modules to outrank support, payment, order, or subscription issues.

## Reward Center

Recommended modules:
- member level
- current points
- available cash back/benefit
- next reward progress
- milestone gifts
- badge collection
- weekly leaderboard / Dose Circle
- connected-wellness integrations
- earn-more actions
- referral/advocacy
- terms / expiration where relevant

## CTA / interaction design

Reward mechanics should not compress the interface into a dense dashboard.

Design rules:
- primary CTAs should have at least ~48px touch height
- add vertical separation between descriptive copy and CTA
- avoid stacking multiple competing filled-green buttons in one module
- use one primary action and secondary text/outlined actions
- preserve Dose's generous major-section rhythm
- never let reward progress bars crowd explanatory copy

## Analytics events

Add to the event taxonomy:

```text
rewards_center_viewed
points_balance_viewed
badge_progress_viewed
badge_unlocked
reward_progress_viewed
reward_redeemed
member_level_viewed
member_level_changed
milestone_gift_viewed
milestone_gift_unlocked
milestone_gift_redeemed
leaderboard_viewed
leaderboard_opted_in
leaderboard_opted_out
review_reward_started
review_reward_completed
daily_tip_viewed
daily_tip_clicked
wearable_connect_started
wearable_permission_result
wearable_connected
wearable_disconnected
```

Existing actions such as `routine_action_logged`, `education_module_completed`, `review_completed`, and `referral_started` remain the canonical underlying behavior events.

## Experiments

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

### Member levels
Hypothesis: visible tier progression increases repeat engagement with approved readiness behaviors.

Primary KPI: qualifying-behavior completion.
Guardrail: app disengagement / reward-cost inflation.
Business outcome: D72/D90 survival.

### Leaderboard
Hypothesis: opt-in weekly social comparison increases routine consistency for customers who choose the community mechanic.

Primary KPI: adherence among opted-in eligible users.
Guardrails: opt-out, support complaints, negative sentiment.

## Guardrails

Gamification must not:
- imply guaranteed health outcomes
- reward positive reviews specifically
- punish missed doses
- incentivize taking more than recommended
- use health/lab metrics for competitive ranking
- expose real names or private activity without opt-in
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
- config/CMS for daily tips, levels, gifts, and earning rules
- inventory/fulfillment mechanism for physical milestone gifts
- Finance/Retention approval for cash-back economics
- privacy controls for leaderboard participation
- native iOS/HealthKit capability for Apple Health/Watch integration
- CX support process for reward disputes

## Definition of success

Gamification is successful if it makes good member behaviors more visible and motivating while improving readiness, adherence, retention, or customer value. More points earned, a higher leaderboard rank, or more wearable data connected are not success metrics by themselves.