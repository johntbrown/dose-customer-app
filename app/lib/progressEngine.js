export const PROGRESS_VERSION = 'progress-v1';

export const DEFAULT_PROGRESS = {
  version: PROGRESS_VERSION,
  takenToday: false,
  reviewSubmitted: false,
  lessonCount: 1,
  bonusPoints: 0,
  journeyOverride: null,
  events: [],
  unlockedBadges: [],
  completedChallenges: [],
  celebrationHistory: [],
};

export const BADGES = [
  { id: 'starter', name: '7-Day Starter', mark: '7', description: 'You built a seven-day Dose routine.', reward: '150 points', type: 'streak', threshold: 7 },
  { id: 'cycle', name: 'Full Cycle', mark: '24', description: 'You completed your first full 24-day routine cycle.', reward: '250 bonus points', type: 'journey', threshold: 24 },
  { id: 'learner', name: 'Dose Scholar', mark: '3', description: 'You completed all three Masterclass lessons.', reward: 'Dose Scholar badge', type: 'lessons', threshold: 3 },
  { id: 'reviewer', name: 'Community Voice', mark: '★', description: 'Thanks for sharing your experience with the Dose community.', reward: '+100 points', type: 'review', threshold: 1 },
];

export const CHALLENGES = [
  { id: 'kickstart', title: '7-Day Kickstart', target: 7, reward: '150 points', source: 'streak' },
  { id: 'builder', title: '21-Day Routine Builder', target: 21, reward: 'Routine Builder badge', source: 'streak' },
  { id: 'master', title: 'Master Your Dose', target: 3, reward: 'Dose Scholar badge', source: 'lessons' },
  { id: 'journey90', title: '90-Day Journey', target: 90, reward: '90-day milestone gift', source: 'journey' },
];

export function getEffectiveJourneyDay(member, progress) {
  return progress?.journeyOverride || member?.lifecycle?.day || 1;
}

export function getDerivedProgress(member, progress = DEFAULT_PROGRESS) {
  const journeyDay = getEffectiveJourneyDay(member, progress);
  const baseTaken = member?.routine?.today_status === 'taken';
  const takenToday = Boolean(baseTaken || progress.takenToday);
  const streak = (member?.routine?.streak_days || 0) + (progress.takenToday && !baseTaken ? 1 : 0);
  const lessonCount = Math.max(member?.education?.completed_modules || 0, progress.lessonCount || 0);
  const reviewSubmitted = Boolean(progress.reviewSubmitted);
  const basePoints = member?.loyalty?.points || 0;
  const points = basePoints + (progress.takenToday && !baseTaken ? 15 : 0) + Math.max(0, lessonCount - (member?.education?.completed_modules || 0)) * 25 + (reviewSubmitted ? 100 : 0) + (progress.bonusPoints || 0);

  const badgeState = BADGES.map(b => {
    const value = b.type === 'streak' ? streak : b.type === 'journey' ? journeyDay : b.type === 'lessons' ? lessonCount : reviewSubmitted ? 1 : 0;
    return { ...b, value, unlocked: value >= b.threshold, progress: Math.min(100, Math.round((value / b.threshold) * 100)) };
  });

  const challenges = CHALLENGES.map(c => {
    const value = c.source === 'streak' ? streak : c.source === 'journey' ? Math.min(journeyDay, c.target) : lessonCount;
    return { ...c, value, complete: value >= c.target, progress: Math.min(100, Math.round((value / c.target) * 100)) };
  });

  return { journeyDay, takenToday, streak, lessonCount, reviewSubmitted, points, badgeState, challenges };
}

export function makeProgressEvent(type, title, detail, metadata = {}) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    title,
    detail,
    metadata,
    occurredAt: new Date().toISOString(),
  };
}

export function getNewUnlocks(before, after, progress = DEFAULT_PROGRESS) {
  const alreadyBadges = new Set(progress.unlockedBadges || []);
  const alreadyChallenges = new Set(progress.completedChallenges || []);
  const badges = after.badgeState.filter(b => b.unlocked && !before.badgeState.find(x => x.id === b.id)?.unlocked && !alreadyBadges.has(b.id));
  const challenges = after.challenges.filter(c => c.complete && !before.challenges.find(x => x.id === c.id)?.complete && !alreadyChallenges.has(c.id));
  return { badges, challenges };
}
