# My Dose Security, Privacy & Medical Boundaries

## Purpose

My Dose handles account, subscription and potentially wellness-related data. Privacy, security and medical boundaries are product requirements, not a launch checklist added at the end.

## 1. Data minimization

Collect only what has a defined customer/product purpose.

V1 app-owned state should focus on:
- identity mapping
- app preferences
- onboarding state
- routine logs
- check-ins
- education progress
- recommendation exposures
- experiment assignments
- service status

Do not replicate complete Shopify/Skio/customer records into the app database.

## 2. Sensitive wellness data

Optional health-marker or sensitive wellness inputs require:
- explicit consent
- clear purpose
- limited destinations
- retention policy
- deletion/export handling
- medical/privacy review

Do not route raw sensitive health values to general analytics tools by default.

## 3. Medical boundary

V1 is:
- education
- expectation setting
- behavior/routine support
- approved product guidance
- provider/service referral

V1 is not:
- diagnosis
- treatment decisions
- autonomous interpretation of labs
- replacing a clinician
- emergency medical guidance

Any future lab interpretation or health-marker guidance requires separate product, legal/privacy and medical review.

## 4. Authentication

Recommended:
- passwordless magic link or SMS OTP
- server-side session management
- secure HTTP-only cookies for web where appropriate
- session expiry/refresh strategy
- rate limiting
- brute-force/OTP abuse protection
- account recovery/support flow

## 5. Authorization

Every customer-scoped API verifies the authenticated user owns the requested resource.

Never trust a client-supplied Shopify/Skio/order ID without server-side ownership validation.

Admin/internal tools require RBAC.

Suggested roles:
- viewer/support
- content editor
- rule manager
- analyst
- engineering admin
- security/admin

## 6. Secrets

- server-side only
- environment/secret manager, never git
- separate credentials by environment
- least privilege
- rotate on schedule/incident
- document owner and scopes

No Shopify/Skio private tokens in browser bundles.

## 7. Encryption

- TLS in transit
- managed encryption at rest
- sensitive app-owned fields additionally protected where appropriate
- backups encrypted

## 8. Logging

Logs must avoid unnecessary PII.

Required:
- request IDs
- auth/authorization result categories
- integration success/failure
- admin mutation audit trail
- subscription mutation audit trail
- webhook processing state
- security-relevant actions

Do not log magic links/OTP codes, full tokens, payment details or unnecessary health data.

## 9. Auditability

Audit log should cover:
- admin content changes
- rule/eligibility changes
- feature-flag changes
- customer subscription mutations initiated by app
- identity merges/manual linking
- privacy deletion/export actions

Fields:
- actor
- action
- target
- before/after or change reference
- timestamp
- request ID
- environment

## 10. Privacy controls

Production plan needs:
- privacy notice coverage
- data inventory
- subprocessor inventory
- retention schedule
- deletion request path
- export/access request path
- consent storage
- consent withdrawal behavior
- marketing consent separation from required account communications

## 11. Consent model

Track independently:
- email marketing
- SMS marketing
- push notifications
- optional health/wellness data
- optional personalization inputs if needed

Do not assume existing marketing consent implies consent for sensitive data collection.

## 12. Vendor security

For each integration document:
- scopes/permissions
- authentication mechanism
- data shared
- data stored by vendor
- webhook verification
- retry/failure behavior
- subprocessor implications
- owner

## 13. Webhooks

All incoming webhooks:
- verify signatures
- validate timestamp/replay where supported
- use idempotency/source event ID
- validate schema
- quarantine malformed events
- expose failure/retry visibility

## 14. Dependency security

Before pilot:
- dependency scanning
- lockfile committed
- vulnerability review
- automated security updates policy
- no unmaintained critical auth/crypto packages

## 15. Application security checks

Minimum:
- input validation
- output encoding
- CSRF protection where relevant
- XSS review
- SSRF protections around server fetches
- rate limiting
- authorization tests
- secure cookie/session settings
- CORS policy
- content security policy where feasible

## 16. Environment isolation

Dev/staging must not casually use production PII.

Use:
- mock data
- synthetic test accounts
- explicitly approved test customer identities

Production credentials never shared with preview builds by default.

## 17. Incident response

Document:
1. detection
2. severity assignment
3. owner/on-call
4. containment
5. rollback/disable feature
6. vendor escalation
7. customer/compliance communication decision
8. postmortem

Feature flags/kill switches should allow disabling risky integrations without taking the entire app offline.

## 18. Privacy-by-feature checklist

Any feature collecting new user input must answer:
- Why do we need it?
- Is it sensitive?
- Where is it stored?
- Who receives it?
- How long is it retained?
- Can user delete/export it?
- Is consent required?
- Does it change medical/compliance scope?

## 19. Pre-pilot security gate

- [ ] threat model reviewed
- [ ] auth/authorization tested
- [ ] vendor scopes minimized
- [ ] secrets isolated
- [ ] dependency scan passed
- [ ] PII logging review passed
- [ ] webhook signatures validated
- [ ] rate limits configured
- [ ] privacy/consent flows approved
- [ ] deletion/export operational path defined
- [ ] incident/rollback owner assigned
- [ ] medical boundaries reviewed for all health-related content/features

## 20. Core principle

The app should make Dose more useful without creating an uncontrolled store of customer health data or a new clinical product by accident.