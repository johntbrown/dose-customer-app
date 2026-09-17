# Badge Unlock Celebration Research

## Product pattern

The strongest achievement systems separate routine feedback from milestone celebration. Routine actions get compact micro-interactions; meaningful achievements can justify a modal or full-screen celebration.

Patterns observed in public implementations and libraries:
- center the earned achievement as the focal object
- use staged motion rather than everything moving at once
- add confetti / particles for milestone moments
- include the achievement name, what was earned, and an obvious continuation CTA
- prevent duplicate celebrations and queue multiple awards if needed
- allow dismissal and respect reduced-motion preferences
- use full-screen celebration selectively so it retains emotional value

## References reviewed

- `react-rewards`: reward micro-interactions including confetti, balloons and emoji, with configurable physics and origin.
- `react-confetti`: configurable full-viewport particle system with piece count, velocity, colors, frame rate and completion handling.
- `partycles`: achievement examples using fireworks / confetti, mobile optimization and promise-based completion.
- `flutter_confetti_engine`: full-screen dialog celebration pattern combining particles, optional feedback and an overlay message.
- OpenContracts achievement issue: proposes toast for ordinary badge awards and a larger celebration modal for significant badges, with duplicate prevention and queuing.

## My Dose implementation choice

For badge unlocks, My Dose uses a full-screen takeover with:
1. dark Dose-green environmental transition
2. concentric reveal rings / glow
3. central badge scale-and-settle reveal
4. brand-controlled cream / beige / green confetti
5. achievement title and short reason
6. optional reward pill
7. one clear `Keep going` CTA

The effect is deliberately more expressive than daily routine feedback. It should be reserved for earned milestones such as badge unlocks, completed challenges and major 90-day moments.

## Accessibility / production notes

- Escape and explicit close control are supported.
- Body scroll is locked while the modal is active.
- `prefers-reduced-motion` disables particle and movement animations.
- Production should record which badge celebration has already been shown so re-renders or repeat sessions do not replay it unintentionally.
- If multiple badges are earned in one transaction, queue them instead of stacking simultaneous takeovers.
