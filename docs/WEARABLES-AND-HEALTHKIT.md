# My Dose Wearables & Apple Health Architecture

## Purpose

Define how My Dose could integrate wearable and health-context data without turning a retention/member app into an uncontrolled health-data product.

## Product thesis

Wearables should provide **context around routine and wellness**, not diagnose, infer treatment response, or claim that Dose caused changes in biometrics.

The highest-value use case is to help members see their Dose routine alongside selected wellness signals they already track.

## Current prototype

The current Rewards Center includes a simulated Apple Watch / Apple Health connection card.

Prototype behavior:
- connect/disconnect interaction
- illustrative steps, sleep and resting-heart-rate values
- clear disclosure that no live Apple Health data is being read

The current web/PWA prototype does **not** have HealthKit access.

## Platform requirement

Apple Health data access is implemented through HealthKit in an iOS/watchOS app context. Production integration therefore requires a native HealthKit-capable surface, even if the rest of My Dose continues to use shared web or cross-platform components.

Apple requires apps to:
- add the HealthKit capability
- declare usage descriptions
- request authorization for each data type to read/share
- respect partial/limited permissions
- allow users to change permissions later

My Dose should request only the minimum data types needed for a defined member feature.

## Recommended V1 wearable scope

Start read-only and narrow.

Candidate signals:
- step count / activity
- sleep duration
- selected heart-rate summaries, only if approved
- workout/activity summaries

Avoid initially:
- clinical records
- lab results through HealthKit
- reproductive health data
- medication data
- raw/high-frequency sensor streams
- writing health data back to HealthKit

## User experience

### Connect flow
1. Member opens Connected Wellness.
2. App explains why connecting helps.
3. Member chooses `Connect Apple Health`.
4. Native iOS layer requests only the required HealthKit permissions.
5. Member can grant full, partial, or no access.
6. App shows only data that was actually authorized and available.
7. Member can disconnect from My Dose at any time.

### Permission language
Do not imply the member must connect Apple Health to use Dose or earn core loyalty benefits.

Connection should be optional.

## Architecture

```text
My Dose UI
  ↓
Native iOS Health Integration Layer
  ↓
HealthKit / HKHealthStore
  ↓
Permissioned local health samples
  ↓
Normalization / privacy filter
  ↓
My Dose wellness-context API or local presentation
```

Preference: perform as much transformation locally as practical and send only the minimum normalized values required for the product experience.

## Example normalized payload

```json
{
  "date": "2026-09-15",
  "activity": {
    "steps": 8432
  },
  "sleep": {
    "duration_minutes": 441
  },
  "heart": {
    "resting_heart_rate_bpm": 64
  },
  "source": "apple_health",
  "permission_version": "1.0"
}
```

Whether heart-rate values are stored server-side should be separately approved. A local-only presentation may be preferable for more sensitive categories.

## Product use cases

### Good use cases
- show a member's routine check-in beside daily activity context
- help members notice broader routines they already track
- provide optional weekly wellness summaries
- personalize non-medical daily tips where explicitly approved
- remind the member that consistency across routines matters

### Do not use for
- diagnosis
- claiming causal product efficacy
- deciding the customer needs medical treatment
- rewarding a specific heart rate, sleep score, body metric, or lab outcome
- competitive leaderboard ranking based on health data
- suppressing access to member benefits based on health metrics

## Gamification boundary

Wearable connection itself may be acknowledged with a neutral onboarding badge, but do not create points incentives that pressure members to disclose health data.

Do not award points for:
- higher step counts
- lower heart rate
- longer sleep
- specific health/fitness outcomes

The leaderboard must remain based on approved engagement behaviors, never private wearable/health signals.

## Apple Watch extension

A future watchOS companion could provide:
- quick `I took my Dose` check-in
- streak glance
- next reminder
- simple milestone progress
- complication / Smart Stack widget

The watch experience should be lightweight. My Dose is not a workout tracker, so a dedicated workout session is not needed for the core use case.

## Backend fields

```text
wearable_connection_status
wearable_provider
wearable_connected_at
wearable_last_sync_at
wearable_permission_version
wearable_enabled_data_types[]
```

Store consent/permission metadata independently from marketing consent.

## Analytics events

```text
wearable_connect_started
wearable_permission_prompted
wearable_permission_result
wearable_connected
wearable_sync_completed
wearable_sync_failed
wearable_disconnected
connected_wellness_viewed
```

Do not place raw biometric values in RudderStack/Mixpanel event properties unless explicitly approved.

## Privacy requirements

- explicit opt-in
- fine-grained permission requests
- explain purpose before the OS permission sheet
- no forced connection
- data minimization
- deletion/disconnect behavior
- clear retention policy
- no use for advertising segmentation without explicit review/authorization
- do not send raw sensitive values to ordinary lifecycle tools

## Rollout recommendation

### Phase 1
Prototype UI only, as currently implemented.

### Phase 2
Native iOS HealthKit proof of concept with internal/test users and read-only activity/sleep data.

### Phase 3
Controlled pilot with explicit privacy review and limited member cohort.

### Phase 4
Evaluate watchOS quick-check-in / complication only if engagement data shows a real need.

## Success criteria

Wearables are useful if they make the Dose routine easier to maintain or make the member experience more coherent. Connection rate alone is not success.

Preferred outcome metrics:
- routine adherence
- reminder usefulness
- repeat app engagement
- retention / subscription survival in a controlled experiment

## Technical references

Use current Apple HealthKit documentation as implementation authority for entitlements, authorization and supported data access. The current repository prototype intentionally does not claim to implement live HealthKit access.