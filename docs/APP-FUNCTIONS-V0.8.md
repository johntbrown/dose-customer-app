# My Dose V0.8 — App Functions: First Login + Member Portal

## Objective
Move the prototype from a set of polished screens toward a coherent member product with clear first-login behavior and a persistent user portal.

## Source reference
The onsite/Figma-derived Home design supplied on 2026-09-15 is the functional reference for the member portal. It includes:
- Personalized welcome and member-support framing
- Subscription benefits/value strip
- Steps for Success with health concierge and clinical nutritionist consultations
- Subscription summary and management entry point
- 12-month Dose journey / expectations module
- Monthly recipe eBooks
- Customer support methods
- Dose community access
- Learn-and-earn / rewards
- Referral offer
- HSA/FSA education

## First-login splash
### Purpose
Orient a logged-in subscriber before dropping them into the full app.

### V0 behavior
- Displays immediately on app load for the demo.
- Explains the four core reasons to use My Dose: product education, results expectations, order tracking, and member benefits.
- Primary CTA continues into the member portal.
- Secondary CTA represents account switching.

### Production behavior
- Show on first authenticated session or first app launch after signup.
- Persist completion state so returning members skip it.
- Personalize by active product and lifecycle month.
- Optional future permissions step: SMS/push notifications, order updates, education reminders.

## User portal
### Navigation role
The portal is the `You` destination and becomes the broad account/member-benefits hub.

### Portal modules
1. Welcome + account context
2. Subscription benefit strip
3. Steps for Success
   - Dose health concierge
   - Clinical nutritionist consultation
4. Subscription summary
   - next delivery
   - cadence
   - savings
   - manage subscription
5. Dose Journey
   - current phase
   - expectations
   - full results timeline handoff
6. Monthly recipe eBooks
7. Support
   - phone/text
   - email
   - chat
8. Community
9. Rewards / learn-and-earn
10. Referral
11. HSA/FSA

## App architecture
Primary mobile navigation remains:
- Today
- Learn
- Orders
- Discover
- You

`You` owns member benefits/account. `Plan` is a deeper subscription-management state reached from the portal and order screens.

## Future integrations
### Authentication
- Shopify customer account / supported auth layer
- first-login flag
- active product(s)
- member lifecycle month

### Subscription
- Skio for subscription status, cadence, next charge, skip/change actions
- Shopify for customer/order/product context

### Orders
- Shopify order status and carrier tracking

### Scheduling
- Health concierge booking provider
- Clinical nutritionist booking provider

### Content
- Recipe eBooks/content CMS
- Education/masterclass content source

### Support/community
- Support chat provider
- phone/email deep links
- Facebook/community destination

### Rewards/referral
- Loyalty points/rewards provider
- referral platform

## Analytics events
Recommended events:
- splash_viewed
- splash_completed
- portal_viewed
- concierge_cta_clicked
- nutritionist_cta_clicked
- subscription_manage_clicked
- journey_viewed
- recipe_opened
- support_channel_clicked
- community_clicked
- referral_clicked
- hsa_fsa_clicked

## Current V0 limitations
All booking, subscription, order, rewards, and support actions are representative demo interactions unless explicitly connected to a production system later.
