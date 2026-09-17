export const MEMBER_STATE_VERSION = '0.1.0';

const shared = {
  identity: {
    dose_customer_id: 'demo-john',
    first_name: 'John',
    demo: true,
  },
  product: {
    primary_product: 'Dose for your Liver',
    owned_products: ['liver'],
  },
  subscription: {
    status: 'active',
    quantity: 1,
    cadence_days: 24,
    payment_status: 'ok',
    next_bill_at: '2026-09-28',
    next_ship_at: '2026-09-28',
  },
  order: {
    status: 'in_transit',
    shipment_exception: false,
    eta_label: 'Oct 1–3',
  },
  support: {
    needs_support: false,
    support_reason_category: null,
    concierge_eligible: true,
    nutritionist_eligible: true,
  },
  education: {
    next_module: 'month-1-expectations',
    completed_modules: 1,
    total_modules: 3,
  },
  loyalty: {
    reward_available: false,
    challenge_state: 'active',
  },
  recommendation: {
    eligible: true,
    target: 'cholesterol',
    suppression_reason: null,
  },
};

export const demoMemberStates = {
  m1: {
    ...shared,
    identity: { ...shared.identity, scenario: 'month_1_active' },
    lifecycle: { day: 18, month: 1, cycle: 1, current_milestone: 'month_1' },
    routine: { today_status: 'not_logged', streak_days: 6 },
    check_in: { due: false, type: null },
    loyalty: { ...shared.loyalty, points: 1240 },
  },
  risk: {
    ...shared,
    identity: { ...shared.identity, scenario: 'month_2_at_risk' },
    lifecycle: { day: 43, month: 2, cycle: 2, current_milestone: 'day_48' },
    routine: { today_status: 'not_logged', streak_days: 2 },
    check_in: { due: true, type: 'm2' },
    support: {
      ...shared.support,
      needs_support: true,
      support_reason_category: 'routine_confidence',
    },
    loyalty: { ...shared.loyalty, points: 760 },
    recommendation: {
      ...shared.recommendation,
      eligible: false,
      suppression_reason: 'support_need',
    },
  },
  engaged: {
    ...shared,
    identity: { ...shared.identity, scenario: 'month_4_engaged' },
    lifecycle: { day: 104, month: 4, cycle: 4, current_milestone: 'post_day_90' },
    routine: { today_status: 'taken', streak_days: 21 },
    check_in: { due: false, type: null },
    education: { ...shared.education, completed_modules: 3, next_module: null },
    loyalty: { reward_available: true, challenge_state: 'nearly_complete', points: 2860 },
  },
  payment_failed: {
    ...shared,
    identity: { ...shared.identity, scenario: 'payment_failed' },
    lifecycle: { day: 24, month: 1, cycle: 1, current_milestone: 'day_24' },
    routine: { today_status: 'not_logged', streak_days: 8 },
    check_in: { due: false, type: null },
    subscription: {
      ...shared.subscription,
      payment_status: 'failed',
    },
    recommendation: {
      ...shared.recommendation,
      eligible: false,
      suppression_reason: 'payment_failure',
    },
  },
};

export function getDemoMemberState(key = 'm1', overrides = {}) {
  const base = demoMemberStates[key] || demoMemberStates.m1;
  return {
    ...base,
    ...overrides,
    routine: { ...base.routine, ...(overrides.routine || {}) },
    check_in: { ...base.check_in, ...(overrides.check_in || {}) },
    support: { ...base.support, ...(overrides.support || {}) },
    subscription: { ...base.subscription, ...(overrides.subscription || {}) },
    order: { ...base.order, ...(overrides.order || {}) },
    education: { ...base.education, ...(overrides.education || {}) },
    loyalty: { ...base.loyalty, ...(overrides.loyalty || {}) },
    recommendation: { ...base.recommendation, ...(overrides.recommendation || {}) },
  };
}
