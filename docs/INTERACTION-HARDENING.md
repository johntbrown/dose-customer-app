# My Dose — Interaction Hardening Contract

## Goal

Every important member action should remain understandable, recoverable, and visually stable under normal latency, slow networks, offline conditions, duplicate taps, and failed writes.

## Interaction rules

1. **Never fake success.** Progress, rewards, subscription state, and payment state change only after the action is confirmed by the relevant source of truth.
2. **Pending is a real state.** The UI keeps the member on the same surface, disables duplicate submission, shows a restrained progress treatment, and preserves surrounding layout.
3. **No double writes.** The interaction orchestrator maintains an in-flight action registry in addition to disabled controls so rapid taps cannot create duplicate mutations.
4. **Failure preserves trust.** Failed actions leave or restore the last confirmed state and explain that nothing was lost.
5. **Offline blocks server-dependent changes.** The app does not queue high-risk subscription/payment mutations silently.
6. **Reward integrity is downstream of confirmation.** Badge, challenge, points, streak, and milestone celebrations cannot fire before the underlying behavior is confirmed.
7. **Critical commerce remains authoritative.** Payment recovery, delay, quantity, skip, and similar subscription actions must wait for Skio/payment-provider confirmation before the normalized member state changes.
8. **Motion supports state.** Saving animations are subtle and reduced-motion safe. Errors do not shake, flash, or punish the member.

## Hardened prototype interactions

- Daily Dose logging
- Masterclass lesson completion
- Wellness/check-in submission
- Review submission and Community Voice unlock
- Recommendation add/remove
- Payment recovery handoff
- Delay-next-order concept
- Quantity-change concept

The prototype deliberately labels commerce interactions as simulations. It demonstrates pending/confirmed/failure UX without claiming a live Skio or payment-provider mutation.

## Leadership QA controls

Open the floating **Demo** control and use **Interaction QA**:

- **Normal** — short realistic confirmation delay.
- **Slow** — approximately 2.2 seconds so pending-state quality can be inspected.
- **Fail next** — the next hardened action fails once, then automatically returns to Normal mode.

Recommended test sequence:

1. Set **Slow** and log the Daily Dose. Confirm layout stays stable while saving and Journey/Rewards update only after confirmation.
2. Set **Fail next**, retry Daily Dose or a lesson. Confirm no points, streak, badge, or celebration fires.
3. Open Wellness, reach the final check-in answer, set **Fail next**, submit, and verify the answers remain available for retry.
4. Trigger Payment Failed, open My Plan, set **Slow**, and try payment recovery. Confirm the failure state remains until a real source of truth would clear it.
5. Submit a review in **Normal** mode and confirm the badge celebration occurs only after the submission is confirmed.
6. Disable network connectivity and attempt a hardened action. Confirm it is blocked with an offline message and state remains unchanged.

## Production replacement path

The interaction layer is UI orchestration only. In production, its `task` functions should call the BFF/API adapters and return only after the relevant system of record confirms the mutation. Routine state should be server persisted and idempotent. Subscription/payment writes should be followed by an authoritative reread before the normalized member state is considered current.
