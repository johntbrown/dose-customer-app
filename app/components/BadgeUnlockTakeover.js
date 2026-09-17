'use client';

import { useEffect, useMemo } from 'react';

const CONFETTI_COLORS = ['#FBF7EE','#E7E2D7','#CEC6AF','#344633','#6C8269','#A8B59F'];

export default function BadgeUnlockTakeover({ active, badge, onClose }) {
  const particles = useMemo(() => Array.from({ length: 54 }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    delay: `${(i % 12) * 45}ms`,
    duration: `${1700 + (i % 7) * 120}ms`,
    drift: `${((i * 19) % 140) - 70}px`,
    rotate: `${(i * 47) % 360}deg`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + (i % 4) * 2,
  })), []);

  useEffect(() => {
    if (!active) return;
    const onKey = e => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = oldOverflow;
    };
  }, [active, onClose]);

  if (!active || !badge) return null;

  return (
    <div className="badgeTakeover" role="dialog" aria-modal="true" aria-labelledby="badgeTakeoverTitle">
      <div className="badgeTakeoverGlow" aria-hidden="true" />
      <div className="badgeTakeoverRings" aria-hidden="true"><i/><i/><i/></div>
      <div className="badgeTakeoverConfetti" aria-hidden="true">
        {particles.map(p => <i key={p.id} style={{
          '--left': p.left,
          '--delay': p.delay,
          '--duration': p.duration,
          '--drift': p.drift,
          '--rotate': p.rotate,
          '--particle': p.color,
          '--size': `${p.size}px`,
        }} />)}
      </div>

      <button className="badgeTakeoverClose" aria-label="Close badge celebration" onClick={onClose}>×</button>

      <div className="badgeTakeoverContent">
        <span className="badgeTakeoverEyebrow">Badge unlocked</span>
        <div className="badgeRevealStage" aria-hidden="true">
          <div className="badgeRevealHalo" />
          <div className="badgeRevealMedal"><span>{badge.mark || '★'}</span></div>
          <div className="badgeRevealSpark s1">✦</div>
          <div className="badgeRevealSpark s2">✧</div>
          <div className="badgeRevealSpark s3">✦</div>
          <div className="badgeRevealSpark s4">✧</div>
        </div>
        <h1 id="badgeTakeoverTitle">{badge.name}</h1>
        <p>{badge.description}</p>
        {badge.reward && <div className="badgeTakeoverReward"><span>Reward</span><strong>{badge.reward}</strong></div>}
        <button className="badgeTakeoverPrimary" onClick={onClose}>Keep going</button>
        <small>Added to your Dose Rewards collection</small>
      </div>
    </div>
  );
}
