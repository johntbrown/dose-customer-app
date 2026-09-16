# My Dose Wellness Profile & Quizzes

## Purpose

The wellness profile gives My Dose a lightweight, member-controlled personalization layer. It should help the app understand what the member is trying to accomplish, how they prefer to be supported, and whether they are currently confident in their routine.

The goal is not to diagnose health conditions. The goal is to improve customer readiness, relevance, support routing, and next-best-action selection.

## Current prototype

The logged-in demo now includes two interactive quizzes:

### 1. Wellness Goals
Questions cover:
- primary wellness priority
- preferred support style
- motivation style

Example outputs:
- primary wellness goal
- preferred support type
- motivation signal

### 2. Routine Check-In
Questions cover:
- current Dose-taking consistency
- confidence in the routine
- most useful next step

Example outputs:
- routine status: On track / Build consistency first
- preferred next action
- recommended support emphasis

## Results experience

The Wellness Profile page summarizes:
- primary goal
- routine status
- preferred support
- recommended next step

The results are illustrative in the demo. Production recommendations should come from the governed next-best-action rules layer documented in `CONTENT-AND-RULES.md`.

## Product behavior

The profile should influence:
- Today/Home primary action
- education/content prioritization
- daily tips
- service/concierge routing
- milestone messaging
- product discovery relevance
- lifecycle channel personalization

It should not override operational priorities such as payment issues, order exceptions, subscription problems, or explicit support needs.

## Suggested normalized fields

```text
wellness_primary_goal
wellness_support_style
wellness_motivation_style
routine_consistency_band
routine_confidence_band
preferred_next_support
wellness_profile_completed_at
routine_checkin_completed_at
wellness_profile_version
```

## Data ownership

App-owned profile inputs should be stored as normalized member preference/check-in state and mapped to `dose_customer_id`.

Do not make Klaviyo the authoritative source of these responses. Klaviyo can receive selected activation-useful profile properties downstream.

## Event contract

Recommended events:

```text
wellness_quiz_started
wellness_quiz_answered
wellness_quiz_completed
routine_checkin_started
routine_checkin_answered
routine_checkin_completed
wellness_results_viewed
wellness_profile_updated
```

Properties should include:
- `dose_customer_id`
- quiz/version
- question ID
- categorical answer value where approved
- resulting normalized profile state
- source screen

Avoid sending unnecessary sensitive free-text data into analytics destinations.

## Privacy boundary

The current questions are wellness/preference signals, not clinical intake.

If future versions collect:
- lab values
- diagnoses
- medications
- symptoms
- clinical notes
- other sensitive health information

then the feature must go through the separate privacy/medical review described in `SECURITY-PRIVACY-MEDICAL.md`.

## Logged-in demo behavior

The public demo intentionally bypasses the old splash/login concept and opens directly into the authenticated member experience for **John**.

The lifecycle-state selector remains for demonstration/QA purposes, but all demo states represent John at different points in his member lifecycle.

Production authentication remains a separate engineering requirement. The demo bypass does not change the production auth architecture documented in `BACKEND-ARCHITECTURE-V0.9.md` and `OPEN-DECISIONS.md`.

## Future production recommendations

### First authenticated session
Use the wellness quiz as an optional personalization step after identity and product recognition, not as a blocker to accessing orders or subscription controls.

### Ongoing check-ins
Repeat a shorter routine/confidence check-in at meaningful lifecycle moments such as Month 1, Month 2, Month 3, or after a support-risk signal.

### Next-best-action integration
Examples:

```text
IF routine_consistency_band = low
THEN prioritize routine support
AND suppress low-priority commerce

IF routine_confidence_band = needs_help
THEN prioritize concierge/support

IF wellness_support_style = progress_tracking
THEN prioritize journey/results content

IF wellness_support_style = expert_help
THEN surface nutritionist/concierge benefit earlier
```

## Success metrics

Diagnostic:
- quiz start rate
- completion rate
- answer distribution
- result/profile view rate
- next-action click-through
- support booking rate by result state

Business outcome:
- D24/D48/D72 survival by profile/check-in state
- cancellation rate
- support resolution
- education completion
- incremental retention impact of personalized routing

Quiz completion by itself is not the business KPI.
