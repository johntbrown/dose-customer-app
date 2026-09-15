# Habit + Progress Engine

## Product goal

Make adherence resilient, not perfect. The app should help customers return to the routine after a miss, understand whether they are using Dose consistently enough to evaluate progress, and surface the right intervention before a subscription decision point.

## V1 behaviors

### Daily logging
Customers can log today’s Dose directly from the home experience.

### Weekly consistency
Display a seven-day view and a weekly consistency percentage. Weekly consistency is more useful than a rigid streak because one missed day should not imply that progress has been lost.

### Missed-day recovery
If a customer misses a day, messaging should encourage an immediate return to routine rather than a restart mentality.

Example:

> Missed yesterday? Nothing resets. Progress is built by returning to the routine, not by being perfect every day.

### Progress confidence
Capture a lightweight self-reported confidence state:

- Seeing progress
- Still optimistic
- Not sure yet
- Not seeing enough

The response should change what the customer sees next. A customer who is unsure or disappointed should receive troubleshooting and expectation-setting before a generic promotional message.

### Readiness
Readiness is a composite product concept, not yet a production scoring model. V1 visualizes whether the customer appears ready to continue based on signals such as:

- routine established
- product usage understood
- recent consistency
- progress checkpoint completion
- inventory fit
- subscription timing fit

## Future decision engine

A production version should use durable customer state and event history to select the next best action.

```text
relationship_state
+ lifecycle_day
+ adherence_state
+ progress_confidence
+ inventory_state
+ subscription_state
+ product
= next_best_action
```

Examples:

- inconsistent usage + pre-rebill -> habit recovery before offer
- high consistency + unsure progress -> expectation and proof checkpoint
- inventory buildup -> cadence adjustment
- payment risk -> billing recovery
- strong progress + healthy inventory -> continue and reinforce value

## Measurement

Primary business outcomes:

- first and second rebill retention
- voluntary churn
- skip and pause behavior
- reactivation after a missed-use period
- long-term retention by early adherence state

Behavioral metrics:

- Dose logs per active customer
- weekly consistency
- missed-day recovery rate
- progress check-in completion
- confidence-state movement
- next-best-action completion

## Guardrails

- Do not make medical promises from subjective check-ins.
- Do not imply that one missed day erases progress.
- Do not optimize for streak length at the expense of healthy recovery behavior.
- Do not treat engagement as proof of causal retention lift without a controlled analysis.
