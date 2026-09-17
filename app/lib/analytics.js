export const ANALYTICS_VERSION = 'my-dose-events-v1';

export function trackPrototypeEvent(name, properties = {}) {
  const payload = {
    event: name,
    properties: {
      schema_version: ANALYTICS_VERSION,
      occurred_at: new Date().toISOString(),
      ...properties,
    },
  };

  if (typeof window !== 'undefined') {
    window.__MY_DOSE_EVENTS__ = window.__MY_DOSE_EVENTS__ || [];
    window.__MY_DOSE_EVENTS__.push(payload);
    window.dispatchEvent(new CustomEvent('my-dose:event', { detail: payload }));
  }

  return payload;
}

export const eventNames = {
  routineLogged: 'routine_logged',
  badgeUnlocked: 'badge_unlocked',
  challengeCompleted: 'challenge_completed',
  reviewSubmitted: 'review_submitted',
  journeyViewed: 'journey_viewed',
  demoScenarioTriggered: 'demo_scenario_triggered',
};
