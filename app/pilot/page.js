'use client';

import { useMemo, useState } from 'react';
import { getDemoMemberState } from '../lib/memberState';
import { getHomeDecision } from '../lib/homePriority';

const LABELS = {
  m1: 'Month 1 · Active',
  risk: 'Month 2 · At risk',
  engaged: 'Month 4 · Engaged',
  payment_failed: 'Payment failed',
};

const moduleCopy = {
  routine: ['Daily routine', 'Keep your routine moving', 'Log today’s Dose and keep your current streak visible.'],
  journey: ['Journey', 'See where you are', 'Review the milestone that matters at this point in your first 90 days.'],
  order: ['Order', 'Stay ahead of your next shipment', 'Track delivery and review upcoming subscription timing.'],
  checkin: ['Check-in', 'Tell us how it’s going', 'A short lifecycle check-in can change what the app prioritizes next.'],
  education: ['Learn', 'Continue your Masterclass', 'Pick up with the next short lesson in your product education track.'],
  support: ['Support', 'Get help from Dose', 'Your current state suggests support should come before rewards or recommendations.'],
  service: ['Member support', 'Expert help is available', 'Concierge and nutritionist support are available when useful.'],
  reward: ['Rewards', 'You have progress to claim', 'A reward or challenge is ready for your attention.'],
  recommendation: ['Recommended', 'A relevant next product', 'Shown only when there is no higher-priority support, payment, or order issue.'],
};

export default function PilotHome() {
  const [scenario, setScenario] = useState('m1');
  const [taken, setTaken] = useState(false);

  const member = useMemo(() => getDemoMemberState(scenario, {
    routine: scenario === 'engaged' ? undefined : { today_status: taken ? 'taken' : 'not_logged' },
  }), [scenario, taken]);

  const decision = useMemo(() => getHomeDecision(member), [member]);

  const primaryTitle = decision.primary_action_id === 'log_routine'
    ? (taken ? 'Daily Dose complete' : 'Take your daily Dose')
    : moduleCopy[decision.primary_module_id]?.[1] || 'Your next best action';

  const primaryBody = decision.primary_action_id === 'fix_payment'
    ? 'Your payment needs attention before we surface rewards, challenges, or product recommendations.'
    : decision.primary_action_id === 'get_support'
      ? 'Support is intentionally prioritized over gamification and commerce for this member state.'
      : decision.primary_action_id === 'complete_checkin'
        ? 'A lifecycle check-in is due and should shape the next action after completion.'
        : decision.primary_action_id === 'log_routine'
          ? `${member.routine.streak_days + (taken ? 1 : 0)} day streak · today is ${taken ? 'logged' : 'not logged yet'}.`
          : moduleCopy[decision.primary_module_id]?.[2] || decision.primary_action_reason;

  return (
    <main className="appShell">
      <header className="appHeader">
        <a className="logo" href="/">Dose</a>
        <span className="demoPill">Pilot architecture</span>
        <a className="avatar" href="/">J</a>
      </header>

      <div className="profileSwitch">
        <span>Normalized state</span>
        <select value={scenario} onChange={e => { setScenario(e.target.value); setTaken(false); }}>
          {Object.entries(LABELS).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
        </select>
      </div>

      <div className="page">
        <section className="simpleHero">
          <span className="eyebrow">Phase 0 pilot shell</span>
          <h1>One useful action,<br/>based on real state.</h1>
          <p>This route proves the normalized member-state contract and deterministic Home priority engine before we refactor the full demo.</p>
        </section>

        <section className="todayAction">
          <div className="checkIcon">{decision.primary_action_priority}</div>
          <div>
            <span className="eyebrow light">Primary action · {decision.primary_action_reason.replaceAll('_', ' ')}</span>
            <h2>{primaryTitle}</h2>
            <p>{primaryBody}</p>
          </div>
          {decision.primary_action_id === 'log_routine'
            ? <button onClick={() => setTaken(!taken)}>{taken ? 'Undo demo' : decision.primary_action_cta}</button>
            : <button>{decision.primary_action_cta}</button>}
        </section>

        <div className="sectionHead">
          <div><span className="eyebrow">Supporting modules</span><h2>Only what matters next.</h2></div>
        </div>

        <section style={{display:'grid', gap:12}}>
          {decision.supporting_module_ids.map(id => {
            const [eyebrow, title, body] = moduleCopy[id] || [id, id, ''];
            return <article className="expectationCard" key={id}>
              <span className="eyebrow">{eyebrow}</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>;
          })}
        </section>

        <div className="sectionHead">
          <div><span className="eyebrow">Decision trace</span><h2>Auditable by design.</h2></div>
        </div>
        <section className="trackingCard">
          <p><strong>Rule version:</strong> {decision.rule_version}</p>
          <p><strong>Primary:</strong> {decision.primary_action_id} (P{decision.primary_action_priority})</p>
          <p><strong>Supporting:</strong> {decision.supporting_module_ids.join(', ') || 'none'}</p>
          <p><strong>Suppressed:</strong> {decision.suppressed_module_ids.join(', ') || 'none'}</p>
          <p><strong>Scenario:</strong> {member.identity.scenario}</p>
        </section>

        <div className="sectionHead">
          <div><span className="eyebrow">Normalized input</span><h2>The UI no longer needs vendor-specific state.</h2></div>
        </div>
        <section className="trackingCard">
          <p><strong>Lifecycle:</strong> Day {member.lifecycle.day} · Month {member.lifecycle.month}</p>
          <p><strong>Routine:</strong> {member.routine.today_status} · {member.routine.streak_days} day streak</p>
          <p><strong>Payment:</strong> {member.subscription.payment_status}</p>
          <p><strong>Order:</strong> {member.order.status}{member.order.shipment_exception ? ' · exception' : ''}</p>
          <p><strong>Check-in:</strong> {member.check_in.due ? `${member.check_in.type} due` : 'not due'}</p>
          <p><strong>Support:</strong> {member.support.needs_support ? member.support.support_reason_category : 'no active support need'}</p>
          <p><strong>Recommendation:</strong> {member.recommendation.eligible ? 'eligible' : `suppressed · ${member.recommendation.suppression_reason}`}</p>
        </section>
      </div>
    </main>
  );
}
