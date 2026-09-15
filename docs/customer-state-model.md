# Customer State Model

## Core idea

The app should decide what to show using a durable customer state model, not a collection of unrelated campaign segments.

## Primary relationship state

One of:
- lead
- one_time_purchaser
- active_subscriber
- paused_subscriber
- former_subscriber

## Secondary overlays

### Product ownership
- liver
- cholesterol
- blood_pressure
- bundle
- multiple_products

### Adherence state
- new
- automatic
- mostly_consistent
- fragile
- at_risk

### Progress confidence
- unknown
- optimistic
- seeing_progress
- unsure
- disappointed

### Subscription fit
- aligned
- inventory_risk
- cadence_mismatch
- billing_risk
- price_risk

### Engagement
- active
- passive
- dormant

## Example next-best-action logic

### New subscriber, Day 1 to 7
Priority:
1. confirm correct usage
2. set expectations
3. capture routine
4. capture customer goal

### Active subscriber, Day 14 to 21, fragile adherence
Priority:
1. recover routine
2. reinforce consistency over perfection
3. confirm inventory
4. prepare for next shipment

### Active subscriber, approaching rebill, cadence mismatch
Priority:
1. show next charge
2. ask inventory question
3. offer date / frequency adjustment
4. avoid default discounting

### Active subscriber, low progress confidence
Priority:
1. show progress checkpoint
2. clarify expectations
3. surface relevant proof / education
4. route support if product fit is unclear

### Paused subscriber
Priority:
1. show pause status
2. estimate remaining product
3. recommend restart timing
4. make resume frictionless

### Former subscriber
Priority:
1. acknowledge prior relationship
2. use exit reason if known
3. offer the most relevant return path
4. avoid generic blanket winback

## Precedence

If customer records conflict, resolve primary relationship state in this order:
1. active_subscriber
2. paused_subscriber
3. former_subscriber
4. one_time_purchaser
5. lead

## Principle

The app should know not only who the customer is, but what problem is most likely to matter next.
