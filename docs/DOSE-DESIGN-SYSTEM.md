# Dose UX & Design System — Source of Truth

This file records the live-theme UX/design-system reference supplied on 2026-09-15. Treat it as the canonical visual system for the My Dose demo unless a newer live-theme extraction supersedes it.

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

## Shape and spacing
- Buttons: pill/stadium, 46px or effectively full pill radius.
- Chips/tags: 40–100px/full pill radius.
- Cards: 1rem–1.5rem radius, never square.
- Spacing rhythm: 0.5rem, 0.7rem, 1rem, 1.5rem, 2rem, 2.5rem, 3rem+.
- Major sections: generous 40–96px separation.
- Internal component padding: comparatively tight/dense.

## Core components
### Buttons
- Primary: deep-green fill, cream text, pill radius, no border.
- Secondary: transparent, black text, 1px black border, pill radius.
- Hover: scale to about 1.03 without color inversion.

### Cards
- Product: cream/neutral background, image, product name, concise benefit line and subscription-first price.
- Info/trust: warm beige rounded card with icon + one-line copy.

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
- Button/card hover scale: 1.03.
- Image hover zoom: ~1.015.
- Standard transition: 0.125–0.15s ease-in-out.
- Drawer/surface: 0.3s cubic-bezier(0.32, 0.72, 0, 1).
- Motion should feel calm and quiet.

## Content/tone
- Specific clinical claims must be asterisked and resolved to methodology/footnote copy.
- Copy is short, confident and second-person.
- Quantified proof is preferred where approved.

## Implementation rule
`app/brand-system.css` is loaded last and is the final visual override layer. New UI should use these tokens and component patterns rather than introducing new accent colors, arbitrary radii, shadow systems or button variants.
