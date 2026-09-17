export const HOME_RULE_VERSION = 'home-priority-v1';

const MODULES = {
  routine: 'routine',
  support: 'support',
  checkin: 'checkin',
  order: 'order',
  journey: 'journey',
  education: 'education',
  service: 'service',
  reward: 'reward',
  recommendation: 'recommendation',
};

function action(id, priority, reason, cta, target, moduleId) {
  return { id, priority, reason, cta, target, moduleId };
}

export function getHomeDecision(member) {
  const suppressed = new Set();
  const candidates = [];

  const criticalPayment = member.subscription?.payment_status === 'failed';
  const shipmentIssue = Boolean(member.order?.shipment_exception);
  const needsSupport = Boolean(member.support?.needs_support);

  if (criticalPayment) {
    candidates.push(action('fix_payment', 0, 'payment_failed', 'Fix payment', 'Plan', MODULES.order));
    suppressed.add(MODULES.reward);
    suppressed.add(MODULES.recommendation);
  }

  if (shipmentIssue) {
    candidates.push(action('review_shipment_issue', 0, 'shipment_exception', 'Review shipment issue', 'Orders', MODULES.order));
    suppressed.add(MODULES.reward);
    suppressed.add(MODULES.recommendation);
  }

  if (needsSupport) {
    candidates.push(action('get_support', 0, member.support?.support_reason_category || 'support_need', 'Get help from Dose', 'You', MODULES.support));
    suppressed.add(MODULES.reward);
    suppressed.add(MODULES.recommendation);
  }

  if (member.routine?.today_status !== 'taken') {
    candidates.push(action('log_routine', 1, 'routine_not_logged', 'I took it', 'Today', MODULES.routine));
  }

  if (member.check_in?.due) {
    candidates.push(action('complete_checkin', 2, `${member.check_in.type || 'lifecycle'}_checkin_due`, 'Complete check-in', 'Wellness', MODULES.checkin));
  }

  if (member.order?.status === 'in_transit') {
    candidates.push(action('track_order', 3, 'order_in_transit', 'Track shipment', 'Orders', MODULES.order));
  } else if (member.subscription?.next_bill_at) {
    candidates.push(action('review_next_order', 3, 'next_order_upcoming', 'Review next order', 'Plan', MODULES.order));
  }

  if (member.lifecycle?.current_milestone) {
    candidates.push(action('review_milestone', 4, member.lifecycle.current_milestone, 'Review your progress', 'Journey', MODULES.journey));
  }

  if (member.education?.next_module) {
    candidates.push(action('continue_learning', 5, member.education.next_module, 'Continue learning', 'Learn', MODULES.education));
  }

  if (member.support?.concierge_eligible || member.support?.nutritionist_eligible) {
    candidates.push(action('book_service', 6, 'service_eligible', 'Explore member support', 'You', MODULES.service));
  }

  if (member.loyalty?.reward_available || member.loyalty?.challenge_state === 'nearly_complete') {
    candidates.push(action('claim_reward', 7, 'reward_or_challenge_ready', 'View rewards', 'Rewards', MODULES.reward));
  }

  if (member.recommendation?.eligible && !member.recommendation?.suppression_reason) {
    candidates.push(action('view_recommendation', 8, member.recommendation.target || 'eligible_recommendation', 'Explore recommendation', 'Discover', MODULES.recommendation));
  } else {
    suppressed.add(MODULES.recommendation);
  }

  candidates.sort((a, b) => a.priority - b.priority);
  const primary = candidates.find(c => !suppressed.has(c.moduleId)) || action('none', 99, 'no_eligible_action', 'View your journey', 'Journey', MODULES.journey);

  const supportingOrder = [
    MODULES.routine,
    MODULES.journey,
    MODULES.order,
    MODULES.checkin,
    MODULES.education,
    MODULES.support,
    MODULES.service,
    MODULES.reward,
    MODULES.recommendation,
  ];

  const eligibleModules = new Set(candidates.filter(c => !suppressed.has(c.moduleId)).map(c => c.moduleId));
  eligibleModules.add(MODULES.journey);

  const supporting = supportingOrder
    .filter(id => id !== primary.moduleId && eligibleModules.has(id) && !suppressed.has(id))
    .slice(0, 4);

  return {
    primary_action_id: primary.id,
    primary_action_reason: primary.reason,
    primary_action_priority: primary.priority,
    primary_action_cta: primary.cta,
    primary_action_target: primary.target,
    primary_module_id: primary.moduleId,
    supporting_module_ids: supporting,
    suppressed_module_ids: Array.from(suppressed),
    rule_version: HOME_RULE_VERSION,
  };
}
