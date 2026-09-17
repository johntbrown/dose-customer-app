# My Dose Home Priority Rules

## Purpose

Home is not a fixed content stack. It is a prioritized decision surface that answers:

**What is the most useful thing for this member to do today?**

Only one primary action should dominate. Supporting modules should be suppressed or reordered based on member state.

## Priority ladder

Evaluate from top to bottom. The first eligible item becomes the primary action unless an explicit override applies.

### P0 — Critical friction / risk

Examples:
- payment failure / dunning state
- shipment exception or fulfillment issue
- subscription issue requiring action
- explicit support need from check-in
- account/identity problem

Primary CTA examples:
- Fix payment
- Review shipment issue
- Get help
- Resolve subscription

Rule: suppress merchandising and nonessential gamification while unresolved critical friction exists.

### P1 — Daily routine

Examples:
- today not logged
- reminder due

Primary CTA:
- Take / log today’s Dose

Secondary actions:
- Later
- Skip / did not take

Rule: do not shame missed days. State should be deterministic and persist across sessions/devices.

### P2 — Lifecycle check-in

Examples:
- M1 / M2 / M3 check-in due
- readiness/support questionnaire due

Primary CTA:
- Complete your check-in

Rule: if a check-in identifies support need, support becomes the next primary action until resolved or intentionally dismissed.

### P3 — Order / rebill readiness

Examples:
- upcoming rebill inside configured window
- shipment expected soon
- running-low risk
- order exception

Primary CTA examples:
- Review next order
- Track shipment
- Update next delivery

Rule: unresolved order/subscription friction outranks education, rewards and recommendations.

### P4 — Journey milestone

Examples:
- Month 1 expectation checkpoint
- Day 24 / 48 / 72 / 90 milestone
- milestone gift available

Primary CTA examples:
- See what to expect this month
- Review your progress
- Claim milestone gift

### P5 — Education

Examples:
- next Masterclass module
- product usage education incomplete
- expectation content due

Primary CTA:
- Continue learning

### P6 — Service opportunity

Examples:
- concierge eligible and not used
- nutritionist eligible and relevant
- support follow-up suggested

Primary CTA:
- Book your concierge call
- Meet with a nutritionist

### P7 — Challenge / reward

Examples:
- active challenge nearly complete
- reward ready to claim
- badge milestone close

Primary CTA examples:
- Finish your challenge
- Claim reward

### P8 — Relevant recommendation

Examples:
- Liver owner without Cholesterol and no suppression state
- approved next-best-product rule

Primary CTA:
- Explore recommended product

Rule: recommendations are always suppressed by unresolved support, fulfillment, payment or subscription friction.

## Supporting module rules

After choosing the primary action, render no more than four supporting modules on Home.

Suggested order:
1. primary action
2. current progress / streak / milestone
3. order or lifecycle context
4. education or support
5. reward or recommendation only when eligible

## Suppression rules

Suppress a module when:
- its action is already completed for the day
- the customer is ineligible
- a higher-priority unresolved issue makes it inappropriate
- the same information is already represented in the primary action
- the module is stale or source state is uncertain

## Example states

### Month 1 active, no issues
Primary: Take today’s Dose
Support: 7-day streak progress, Month 1 expectations, next shipment, Masterclass

### Month 2 at risk / support need
Primary: Get help from Dose
Support: check-in summary, next order, expectations
Suppress: cross-sell, leaderboard, low-value rewards

### Payment failed
Primary: Fix payment
Support: subscription details, support
Suppress: challenges, rewards, Discover, referral

### Daily Dose already logged
Primary: Complete Month 1 check-in if due; otherwise next best eligible action
Support: streak, journey, order, education

## Required normalized inputs

```text
routine_today_status
routine_streak_days
check_in_due
check_in_type
needs_support
support_reason_category
payment_status
next_bill_at
next_ship_at
order_status
shipment_exception
subscription_status
lifecycle_day
lifecycle_month
current_milestone
education_next_module
service_eligibility
reward_available
challenge_state
recommendation_eligibility
recommendation_suppression_reason
```

## Output contract

The rules layer should return:

```text
primary_action_id
primary_action_reason
primary_action_priority
supporting_module_ids[]
suppressed_module_ids[]
rule_version
```

This should be deterministic and auditable in V1. AI should not independently decide high-stakes support, subscription or health actions.
