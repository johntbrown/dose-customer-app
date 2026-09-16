# My Dose Feature Expansion V1

## Purpose

This document captures the approved prototype expansion inspired by a review of open-source habit, wellness, medication-reminder, fitness, and journaling apps. The goal is to extend My Dose beyond subscription management into a persistent member experience that helps customers build a routine, understand progress, stay accountable, and see the story of their first 90 days.

## Approved feature set

The following concepts are approved for prototype exploration:

1. Home / lock-screen widgets
2. Actionable reminders with Taken / Later / Skip patterns
3. 90-day calendar heatmap
4. Personal trend charts and insights
5. 7-, 21-, and 90-day challenges
6. Private Dose Circles
7. Encouragement actions and shared Circle bonuses
8. Apple Health / Apple Watch / Siri / Shortcuts concepts
9. Calendar integration
10. Optional wellness journal / check-ins
11. Filterable activity history
12. 90-Day Wellness Report / export concept
13. Day-level calendar history

Explicitly not included in this expansion: habit-strength scoring, flexible non-daily Dose goals, a weekly recap, saved-content library, custom routine presets, haptics, or offline-first architecture.

## Prototype implementation

A dedicated feature-exploration route is available at `/features` and is linked from the logged-in Member Portal.

The prototype groups the approved ideas into six coherent product areas rather than presenting them as disconnected features.

### 1. My Journey

Includes:
- 90-day calendar heatmap
- day-level activity detail
- consistency summary
- current streak
- milestone count
- filterable history for Dose, wellness, education, orders, and rewards

Production intent: create a durable visual record of the member journey and make historical progress easy to understand.

### 2. Insights

Includes:
- 30-day consistency trend
- wearable-context examples for sleep and activity
- self-reported energy trend
- optional wellness journal
- descriptive pattern callout

Guardrail: correlations must not be presented as evidence that Dose caused a health outcome.

### 3. Challenges

Prototype challenges:
- 7-Day Kickstart
- 21-Day Routine Builder
- Master Your Dose
- 90-Day Journey

Challenges should reinforce approved member behaviors and should never incentivize taking more than the recommended amount.

### 4. Dose Circle

Includes:
- small private accountability group
- shared streak/status display
- encouragement action
- group consistency bonus

Production privacy principle: health details remain private unless a member explicitly chooses to share them. Circle mechanics should default to minimal behavioral status, not medical or wellness detail.

### 5. Dose Everywhere

Prototype surfaces:
- home / lock-screen widget
- actionable notification
- Apple Health
- Apple Watch
- Siri + Shortcuts
- Calendar

These are simulated in the web prototype. Real implementations require native platform capabilities, explicit permission, and appropriate privacy review.

### 6. 90-Day Wellness Report

Prototype report includes:
- routine consistency
- longest streak
- total Dose days
- education completion
- self-reported wellness trend
- optional wearable summary
- milestones
- download/share concepts

Potential recipients:
- customer
- Dose nutritionist
- physician, only when the customer explicitly chooses to share

The report must remain descriptive and must not imply diagnosis, treatment, or guaranteed outcomes.

## Data model additions

Candidate normalized fields:

```text
journey_day
routine_completed
routine_completed_at
wellness_checkin_id
wellness_energy
wellness_digestion
wellness_sleep_self_report
wellness_note
challenge_id
challenge_status
challenge_progress
circle_id
circle_member_id
circle_share_level
encouragement_sent_at
widget_enabled
notification_actions_enabled
calendar_connected
siri_shortcut_enabled
healthkit_connected
report_period_start
report_period_end
```

## Analytics events

Candidate events:

```text
journey_calendar_viewed
journey_day_opened
journey_history_filtered
wellness_checkin_started
wellness_checkin_completed
insight_viewed
challenge_viewed
challenge_joined
challenge_completed
circle_opened
circle_invite_started
circle_encouragement_sent
circle_bonus_unlocked
widget_enabled
notification_action_used
calendar_connected
siri_shortcut_enabled
healthkit_connected
wellness_report_viewed
wellness_report_downloaded
wellness_report_shared
```

## Product principles

- Progress should be visible without becoming punitive.
- The app should reward useful behavior, not screen time.
- Private accountability should be opt-in and minimally revealing.
- Wellness trends should be descriptive, not diagnostic.
- Native integrations should reduce friction around the daily routine.
- Historical memory should make the app more valuable over time.
- All prototype values are illustrative until production economics, privacy rules, and system-of-record ownership are approved.

## Production dependencies

- canonical customer identity
- routine event capture
- challenge/rules configuration
- normalized wellness check-in storage
- consent model for wearable and wellness data
- Circle privacy/share controls
- native iOS capabilities for HealthKit, widgets, Watch, Siri, and notification actions
- calendar provider integration
- reporting/export service
- RudderStack event delivery
- Mixpanel product analytics
- warehouse retention/LTV measurement

## Success criteria

The expanded feature set should be evaluated against member readiness and retention outcomes, not usage alone. Relevant measures include routine adherence, D24/D48/D72/D90 subscription survival, education completion, service engagement, challenge completion, and downstream LTV. App opens, points, and social interactions are diagnostic metrics rather than the business outcome.
