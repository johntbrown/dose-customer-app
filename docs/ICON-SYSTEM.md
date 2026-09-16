# My Dose Icon System

## Purpose

Replace text glyphs, emoji-like placeholders, and inconsistent symbols with one calm, premium, app-native icon language.

Implementation source:
- `app/icon-system.css`

The current prototype uses lightweight inline SVG masks in CSS. This keeps icons crisp at every size, allows them to inherit the Dose color system, and avoids loading bitmap assets for simple utility icons.

## Style rules

- rounded, simple line icons
- consistent stroke weight
- monochrome only
- inherit current UI color
- no emoji
- no Unicode symbols used as visual icons
- utility icons should support the content, not compete with it
- 20–24px is the default UI size
- 30–32px is reserved for feature moments
- reward/badge artwork can become more illustrative later, but navigation and utility icons should remain restrained

## Size scale

| Role | Size |
| --- | --- |
| Small inline utility | 16–18px |
| Standard action/UI | 20–22px |
| Bottom navigation | 23–24px |
| Feature card icon | 26–32px |

## Screen-by-screen map

### Global navigation
| Surface | Icon |
| --- | --- |
| Today | Home |
| Learn | Open book |
| Orders | Package |
| Discover | Compass |
| You | Person/profile |

### Today
| Surface | Icon |
| --- | --- |
| Daily Dose incomplete | Circle |
| Daily Dose complete | Check-circle |
| Current streak | Flame |
| Order status | Package |
| Drill-in / next action | Chevron right |

### Learn
| Surface | Icon |
| --- | --- |
| Learn tab | Open book |
| Completed learning state | Check |
| Results timeline CTA | Chevron right |
| Future video lesson | Play-circle |
| Future science/article content | Book / document |

### Journey
| Surface | Icon |
| --- | --- |
| Milestone complete | Check-circle |
| Current milestone | Progress marker |
| Previous / next phase | Chevron left / right |

### Orders
| Surface | Icon |
| --- | --- |
| Order confirmed | Check |
| Shipped / in transit | Package |
| Pending delivery | Circle |
| Order card | Package |
| Drill-in | Chevron right |

### Discover
| Surface | Icon |
| --- | --- |
| Discover tab | Compass |
| Add success | Check-circle |
| Product details | Chevron right |
| Future recommendation reason | Spark / target icon if added |

### Rewards
| Surface | Icon |
| --- | --- |
| Streak badge | Flame |
| Full-cycle badge | Medal |
| Learning badge | Open book |
| Review badge | Star |
| Milestone gift | Gift |
| Travel case milestone | Bag / travel case |
| Unlocked reward | Check-circle |
| Leaderboard | Trophy |
| Apple Health / wearable | Watch |
| Daily action reward | Check-circle |
| Learn & earn | Open book |
| Review | Star |
| Referral | Share |

### Wellness profile
| Surface | Icon |
| --- | --- |
| Quiz / assessment | Clipboard |
| Answer navigation | Chevron right |
| Back | Chevron left |
| Future goal result | Target / progress icon |
| Future expert recommendation | Person / chat icon |

### You / Member Portal
| Surface | Icon |
| --- | --- |
| Phone support | Phone |
| Email support | Mail |
| Chat support | Chat bubble |
| Rewards | Medal / gift |
| Wellness profile | Clipboard |
| Subscription | Package / calendar |
| Journey | Progress / milestone |
| Recipes | Book |
| Referral | Share |

## Production recommendation

For the production app, the preferred implementation is a reusable React icon component wrapping one approved SVG family or a Dose-owned SVG set. Do not scatter raw SVG markup across feature components.

Recommended API shape:

```jsx
<Icon name="home" size={24} />
<Icon name="package" size={20} />
<Icon name="gift" size={28} />
```

This should ultimately replace CSS selector-based icon assignment once the prototype architecture is reconciled.

## Accessibility

Decorative icons should be hidden from assistive technology.

Meaningful standalone icon buttons need an accessible label, for example:

```jsx
<button aria-label="Next journey phase">
  <Icon name="chevron-right" />
</button>
```

Never rely on icon shape alone to communicate state when text/status can clarify it.

## Current prototype note

The CSS-mask implementation intentionally replaces the visible placeholder glyphs without forcing a large markup refactor during the current prototype phase. The next production pass should move icon assignment into components so the visual and semantic systems are both explicit.