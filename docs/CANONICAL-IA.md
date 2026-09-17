# My Dose Canonical Information Architecture

## Decision

The current prototype contains two overlapping navigation systems: the primary app and the separate feature-exploration hub. The pilot should consolidate these into one member experience.

## Primary navigation

### 1. Today
Purpose: answer the most useful action now.

Contains:
- primary next-best action
- routine state
- urgent subscription/order/support issues
- current milestone
- current education step
- contextual reward or recommendation only when appropriate

### 2. Journey
Purpose: show progress and history over time.

Contains:
- 90-day calendar/history
- Month 1 / 3 / 6 / 12 expectations
- check-in history
- wellness trends where approved
- education milestones
- order/subscription milestones
- challenge progress
- 90-day report entry point

### 3. Learn
Purpose: explain product use, expectations and approved health education.

Contains:
- product intro
- usage
- Masterclass
- progress/measurement education
- recipes/guides when strategically useful

### 4. Orders
Purpose: give members confidence and control over fulfillment and subscription.

Contains:
- current order
- tracking
- next bill / next ship date
- subscription cadence/quantity
- approved self-service mutations
- cancellation/save-flow entry point

### 5. You
Purpose: house member-level settings, benefits and services.

Contains:
- wellness profile/goals
- rewards and milestone gifts
- concierge/nutritionist
- support
- Dose Circle
- referral
- connected routine/integrations
- account/preferences

## Contextual experiences

These should be accessible, but not permanent primary navigation items:

### Challenges
Surface on Today, Journey and Rewards when active/relevant.

### Discover
Use as a recommendation destination or card, not permanent bottom nav for the pilot.

### Rewards
Surface through You and contextually when a benefit is available.

### Wellness
Profile under You; due check-ins may temporarily become the primary Today action.

### 90-Day Report
Entry point from Journey at/after the relevant milestone.

### Dose Circle
Entry point from You; Circle activity can appear contextually in Journey/Rewards.

### Connected Routine
Entry point from You; notification/calendar/native integration setup lives here.

## Migration from current prototype

### Keep
- Today
- Journey concepts from both existing timeline and `/features`
- Learn
- Orders
- You / Member Portal

### Merge
- `/features` Journey + existing Journey -> canonical Journey
- `/features` Insights -> Journey > Insights
- `/features` Report -> Journey > 90-Day Report
- `/features` Circle -> You > Dose Circle
- `/features` Everywhere -> You > Connected Routine
- `/features` Challenges -> contextual modules + Journey challenge history
- Rewards -> You > Rewards, with contextual Home surfaces

### Demote
- Discover from permanent nav to recommendation destination

### Demo-only
- lifecycle-state switcher
- fake John data
- simulated Apple Health/Watch values
- illustrative loyalty economics
- demo leaderboard

## Navigation principle

A member should never need to understand the internal organization of Dose systems. The product should feel like one relationship:

- Today = what should I do now?
- Journey = how am I progressing?
- Learn = what should I understand?
- Orders = where is my product / what can I change?
- You = my support, benefits and preferences
