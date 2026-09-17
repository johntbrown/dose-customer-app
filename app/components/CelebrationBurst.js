'use client';

const STAR_COUNT = 14;

export default function CelebrationBurst({ active=false, label='Success' }) {
  if (!active) return null;

  return (
    <div className="celebrationBurst" aria-live="polite" aria-label={label}>
      <div className="celebrationHalo" aria-hidden="true" />
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <span
          key={index}
          className={`celebrationStar celebrationStar${index + 1}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="celebrationMessage">{label}</span>
    </div>
  );
}
