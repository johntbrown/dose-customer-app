# Dose UX & Design System — Source of Truth

This file records the live-theme UX/design-system reference supplied on 2026-09-15. Treat it as the canonical visual direction for My Dose unless a newer approved extraction supersedes it.

## Brand feel
Clinical but warm. Earthy, editorial and calm. Avoid startup-SaaS styling. Use serif display type with grounded sans UI/body text, cream backgrounds, deep forest green as the only strong UI accent, black text and warm beige/tan neutrals.

## Color tokens
- Background / neutral 100: `#FBF7EE`
- Foreground: `#000000`
- Primary green: `#344633`
- Neutral 300: `#E7E2D7`
- Neutral 500: `#CEC6AF`
- White: `#FFFFFF`
- Low-stock/product accent only: `#EE9441`
- Primary-button text: `#FBF7EE`

Only green should act as a strong UI accent. Orange belongs to product/photography moments, not app chrome.

## Typography
- Display: Reckless Standard S, serif. Demo fallback: Georgia, Times New Roman, serif.
- Body/UI: Lazzer, sans-serif. Demo fallback: -apple-system, Inter, Helvetica Neue, sans-serif.
- Display/headings: light weight, normal display line-height around 1.1.
- Body: line-height around 1.5.
- Buttons are sentence/title case, not forced uppercase.
- Functional mobile text should generally remain 12px or larger; 14–16px is preferred for meaningful action/support copy.

## Shape and spacing
- Buttons: pill/stadium, 46px minimum visual height; primary actions target 50px+.
- Chips/tags: full pill radius.
- Cards: 1rem–1.75rem radius, never square.
- Spacing rhythm: 0.5rem, 0.75rem, 1rem, 1.25rem, 1.75rem, 2.25rem, 3rem+.
- Major sections: generous 40–96px separation.
- Internal component padding: comparatively tight/dense.
- Mobile controls should target roughly 44px or larger for touch accessibility.

## Core components
### Buttons
- Primary: deep-green fill, cream/white text, pill radius.
- Secondary: white/translucent surface, dark text, subtle green-gray border, pill radius.
- Hover: restrained lift/scale; never invert into an unrelated accent color.
- Press: subtle scale-down feedback is appropriate.

### Cards
- Product: cream/neutral background, image, product name, concise benefit line and subscription-first price.
- Info/trust: warm beige rounded card with icon + one-line copy.
- Important transactional cards may use a low-elevation shadow, but the product should not look like a SaaS dashboard.

### Drawers/modals
- Right slide-in cart drawer, cream surface, dimmed background.
- Centered personalization/quiz modal with logo, large serif headline and stacked pill answer buttons.

### Data/proof
- Large serif stat + small sans caption, with footnote methodology.
- Horizontal metric tabs for data categories.

### Timeline
- Horizontal Month 1 / Month 3 / Month 6 / Month 12 selector that swaps supporting copy/media.

### Sticky
- Bottom sticky CTA pattern is acceptable for transactional/product actions.

## Motion
Motion should feel calm during navigation and expressive only when the member has completed something worth celebrating.

### Ambient / navigation motion
- Card/button hover: restrained 1–2px lift or ~1.015 scale.
- Screen entry: very small fade + 4–8px rise.
- Standard UI transition: ~140–220ms ease.
- Drawer/surface: ~300ms cubic-bezier(0.32, 0.72, 0, 1).
- Primary unresolved Today action may use an infrequent soft pulse to attract attention.

### Celebration motion
Celebrations are reserved for meaningful completed actions, not passive engagement.

Approved prototype examples:
- review submitted → star-burst / Community Voice unlock
- major milestone or gift claimed → brief halo/glow + confirmation
- challenge completed → restrained success burst
- daily Dose completion → subtle completion response, not a large confetti treatment

Do not celebrate:
- screen opens
- scrolling
- ordinary navigation
- product recommendations
- repeated taps

The intensity should match the value of the action. A review/milestone may receive a visibly joyful response; a daily routine check should remain quiet.

### Accessibility
- Respect `prefers-reduced-motion`.
- Reduced-motion users must still receive a clear textual/state confirmation.
- Animation must never be required to understand success or failure.

## Content/tone
- Specific clinical claims must be asterisked and resolved to methodology/footnote copy.
- Copy is short, confident and second-person.
- Quantified proof is preferred where approved.

## Implementation rule
`app/design-foundation.css` is the canonical shared token/component authority and is intentionally loaded after legacy/screen styles while the CSS stack is consolidated. `app/celebrations.css` is loaded after it for narrowly scoped purposeful motion.

New shared UI should use the `--dose-*` token family. `--app-*` and `--fd-*` remain compatibility mappings only and should not be expanded with new concepts. Screen-specific CSS should consume canonical tokens rather than defining a second color, radius, shadow, or spacing system.

Legacy CSS files remain temporarily to avoid regressions during the prototype refactor. Their shared visual responsibilities should migrate into `design-foundation.css` before they are deleted.
