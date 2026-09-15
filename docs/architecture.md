# V1 Architecture

## Product architecture

The app is a presentation and decision layer over existing systems, not a replacement for them.

## Recommended stack

- Next.js
- React
- TypeScript
- CSS modules / global CSS for prototype
- server-side API adapters for future integrations

## System roles

### Commerce
Source of truth for:
- orders
- products
- customer commerce history

### Subscription platform
Source of truth for:
- subscription state
- next charge
- next shipment
- skip / pause / frequency changes

### Customer data layer
Source of truth for:
- durable customer ID
- relationship state
- product ownership
- derived lifecycle fields

### Messaging platform
Consumes app and customer-state signals for lifecycle messaging.

### App
Owns:
- customer experience
- app interaction events
- next-best-action rendering
- progress / habit UX

## V1 integration pattern

For prototype:
- mock customer JSON
- mock subscription actions
- local next-best-action logic

For production:
- API adapters to Shopify / subscription platform
- customer-state endpoint from warehouse / CDP
- event stream to warehouse and lifecycle tools

## Security / privacy principles

- never expose private API credentials client-side
- minimize sensitive health data
- separate wellness support from medical advice
- log only data required for product operation and measurement
- use authenticated customer identity before showing subscription details

## Architecture principle

One customer identity, multiple systems of record, clear ownership for every field and event.
