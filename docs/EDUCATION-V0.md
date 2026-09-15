# My Dose Education — V0.4

## Decision
For the leadership demo, My Dose will recreate one representative native education journey rather than reproducing every TAPP product/goal/size/subscription variant.

## Source
The June 2026 Dose Daily TAPP URL document is the source map. It shows a post-purchase/Month 1 entry experience and separate Masterclass Day experiences, with TAPP URLs branching by health goal, bottle size, and OTP/subscriber state.

## V0 scope
- Product placeholder: **Dose for your Liver**
- Native app destination: **Education**
- Program: **Liver Masterclass**
- Representative lessons: Day 1, Day 2, Day 3
- Today screen includes a Continue Learning module
- Education completion appears in Progress
- Lessons have completion state in the demo
- Mobile-first presentation uses the established Dose demo brand tokens

## Important content limitation
The V0 lesson copy is intentionally representative and simplified. It is not presented as a verbatim transcription of the full TAPP lesson content because the supplied URL map identifies the experiences/variants but does not itself contain the complete content of every destination. Production should replace illustrative lesson copy with approved source content.

## Future architecture
The education system should be data/config driven so a single component system can later personalize by:
- Product/formula
- Health goal
- Lifecycle month/day
- OTP vs subscriber
- Bottle size
- Completion state
- Behavioral/customer state

Potential future module types include article/lesson, video, quiz, poll/check-in, routine builder, progress milestone, product education, subscriber benefit, and CTA/action.

## Strategic rationale
TAPP proves the education mechanic. My Dose turns it into a persistent first-party member capability tied directly to habit formation, progress, customer state, subscription experience, and retention measurement.

## Demo narrative
1. Customer lands on Today.
2. Daily adherence and education are presented together.
3. Continue Learning opens the Liver Masterclass.
4. Customer completes sequential lessons.
5. Education completion feeds the Progress experience.
6. Future production versions personalize the same framework rather than creating separate hard-coded apps for every TAPP URL variant.
