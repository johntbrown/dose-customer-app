# My Dose Content, CMS & Rules

## Purpose

Define how product education, expectation-setting, member services, recommendations and next-best actions should be managed without hard-coding business logic into React components.

## 1. Guiding principle

The app should separate:

1. **Member state** — what is true about the customer
2. **Eligibility/rules** — what the customer is allowed or recommended to see/do
3. **Content** — the approved copy/media presented
4. **Presentation** — how the app renders it

This allows product, retention, content and medical/legal review to iterate without requiring a code release for ordinary changes.

## 2. Content model

### `content_item`

```text
id
type
slug
title
subtitle
body
cta_label
cta_target
media
product_tags[]
lifecycle_tags[]
goal_tags[]
service_tags[]
claims_disclaimer_id
status: draft | review | published | archived
version
published_at
```

Content types:
- product_intro
- lesson
- article
- guide
- recipe
- FAQ
- milestone
- support_card
- service_card
- reward_card
- recommendation_creative
- proof_callout

## 3. Education program model

```text
program
  id
  title
  product
  eligible_lifecycle_stages[]
  modules[]
  version

module
  id
  type
  title
  content_item_id
  unlock_rule_id
  completion_rule
  estimated_minutes
```

Do not clone program components by product. Use a shared component system with product-specific content/config.

## 4. TAPP migration

Current TAPP structure includes product/goal/oz/OTP variants and Masterclass steps. Native My Dose should progressively replace the presentation layer while preserving meaningful segmentation.

Migration rules:
- choose product/serving track once at program entry when possible
- avoid re-checking raw SKU conditions at every module
- preserve historical TAPP engagement events where useful
- normalize completion into native education progress
- do not make the client dependent on TAPP URLs in the long-term architecture

## 5. Next-best-action (NBA) engine

V1 should be deterministic, config/rule driven and auditable.

### Possible actions

```text
take_dose
complete_check_in
review_expectations
track_order
resolve_payment_issue
manage_subscription
book_concierge
book_nutritionist
continue_education
claim_reward
view_guide
explore_product
```

### Priority model

Default priority, highest first:

1. urgent operational/safety issue
2. payment/order/subscription issue
3. explicit support need
4. required/due check-in
5. daily routine action
6. lifecycle expectation milestone
7. education continuation
8. eligible service benefit
9. reward/milestone
10. commerce/recommendation

Commercial recommendations should not outrank unresolved friction.

## 6. Rule object

```json
{
  "rule_id":"nba_m2_checkin_due_v1",
  "status":"active",
  "priority":400,
  "conditions":[
    {"field":"lifecycle.stage","operator":"eq","value":"m2"},
    {"field":"progress.check_in_state","operator":"eq","value":"due"},
    {"field":"support.needs_support","operator":"eq","value":false}
  ],
  "result":{
    "action":"complete_check_in",
    "content_id":"m2_checkin_home_card_v1"
  },
  "version":"1.0"
}
```

Rules must log why they matched.

## 7. Cross-sell rules

Core ownership logic:
- owns Liver, not Cholesterol → Cholesterol eligible
- owns Cholesterol, not Liver → Liver eligible
- owns both → suppress those cross-sells
- future products → choose highest-priority complementary eligible product

Suppress recommendation if:
- inactive/cancelled subscriber where merchandising is inappropriate
- unresolved support need
- failed payment/order exception requiring action
- product already owned
- inventory/offer unavailable
- customer in incompatible experiment holdout

The routing system decides **who/what**. Creative determines **how** the recommendation is communicated.

## 8. Commitment / annual-plan logic

Normalize state:

```text
commitment_eligible
commitment_status: ineligible | eligible | engaged | converted | expired
```

Content rules:
- no-offer experience when ineligible
- eligible experience when eligible
- optionally modified follow-up when engaged
- suppress all remaining offer content after conversion

All channels should consume the same state.

## 9. Support rules

One support architecture across products:

```text
IF needs_support = true
THEN surface concierge/support next action
AND suppress nonessential merchandising
```

Product context personalizes the message, not the operational path.

## 10. Review rules

Primary gate: `review_eligible`.

Target product determined by ownership/approved bundle rule. Do not create mirrored downstream journeys solely to change product reference.

## 11. Expectations / journey content

Milestones should be content/config, not encoded directly in component text.

Suggested structure:
- Month 1: habit/usage foundation
- Month 3: approved result/proof checkpoint
- Month 6: longer-term progress / bloodwork education where approved
- Month 12: long-term routine / next journey

Every claims-bearing content item must reference an approved disclaimer/methodology footnote.

## 12. CMS/admin minimum capability

Business users need to be able to:
- draft/edit content
- tag by product/lifecycle/goal
- preview member states
- schedule publish/unpublish
- manage expectation milestones
- manage recommendation creative
- manage rule enable/disable and priority
- inspect why a rule matched
- see version history
- roll back a content/rule version

Do not expose vendor credentials or unrestricted code execution through admin tooling.

## 13. Approval workflow

Suggested states:

```text
draft → product_review → medical/legal_review_if_needed → approved → published
```

Changes to pure layout copy may not need medical review; product claims, health-marker language and clinical proof do.

## 14. Feature flags vs business rules

Use feature flags for:
- rollout percentage
- pilot cohorts
- kill switches
- experiments
- major feature availability

Use business rules for:
- eligibility
- next-best action
- product recommendation
- support routing
- content targeting

Do not mix the two into one opaque rules engine.

## 15. Rule observability

Every evaluated recommendation/NBA should be traceable with:
- customer ID
- rule ID/version
- eligibility inputs used
- matched/suppressed outcome
- suppression reason
- content ID shown
- timestamp
- subsequent action/outcome

This is required for product debugging, CX explanation and experiment analysis.

## 16. Content fallback behavior

If targeted content fails:
- fall back to approved generic product content
- never show blank/broken modules
- do not fall back from a support/action module into commerce
- keep operational subscription/order utility available independently

## 17. Versioning

Content and rules should be versioned so historical analytics can answer what a customer actually saw. Event payloads should include `content_id`, `content_version`, `rule_id` and `rule_version` when relevant.