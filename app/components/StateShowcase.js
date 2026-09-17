'use client';

import { useState } from 'react';
import { emitDoseToast } from '../lib/asyncContract';

const states=['Loading','Empty','Error','Stale','Saving','Success'];

export default function StateShowcase(){
  const [active,setActive]=useState('Loading');
  const [saving,setSaving]=useState(false);

  const save=()=>{
    setSaving(true);
    setTimeout(()=>{
      setSaving(false);
      setActive('Success');
      emitDoseToast({title:'Routine saved',message:'Your progress is up to date.'});
    },900);
  };

  return <div className="page stateShowcasePage">
    <section className="simpleHero"><span className="eyebrow">Production-state preview</span><h1>Beautiful when things<br/>aren’t perfect.</h1><p>Loading, empty, stale, error, and saving states use the same calm Dose design language as the happy path.</p></section>
    <nav className="stateTabs" aria-label="Preview app states">{states.map(state=><button key={state} className={active===state?'active':''} onClick={()=>setActive(state)}>{state}</button>)}</nav>

    <section className="statePreviewFrame">
      {active==='Loading'&&<div className="stateInlineSkeleton" aria-busy="true"><div className="skeleton skeletonEyebrow"/><div className="skeleton skeletonCardTitle"/><div className="skeleton skeletonBody wide"/><div className="skeleton skeletonBody"/><div className="skeleton skeletonButton"/></div>}

      {active==='Empty'&&<div className="stateInlineCard"><div className="stateMark">○</div><span className="eyebrow">Nothing here yet</span><h2>Your history will build as you go.</h2><p>Complete a Dose, lesson, check-in, or milestone and it will appear here automatically.</p><button className="primary" onClick={()=>setActive('Saving')}>Log today’s Dose</button></div>}

      {active==='Error'&&<div className="stateInlineCard error"><div className="stateMark">!</div><span className="eyebrow">Couldn’t refresh</span><h2>Your last saved data is still safe.</h2><p>We couldn’t reach the server. Retry without losing the progress already on this device.</p><button className="primary" onClick={()=>setActive('Loading')}>Try again</button></div>}

      {active==='Stale'&&<div className="stateInlineCard stale"><div className="stateStatusRow"><span className="stalePill">Last updated 18 min ago</span><span>Using saved data</span></div><span className="eyebrow">Journey</span><h2>18-day streak</h2><p>You can keep browsing. We’ll refresh this view when the connection catches up.</p><div className="stateMetricStrip"><div><span>Points</span><strong>1,240</strong></div><div><span>Journey day</span><strong>18</strong></div></div></div>}

      {active==='Saving'&&<div className="stateInlineCard saving"><div className="stateMark savingSpinner"/><span className="eyebrow">Saving progress</span><h2>Updating your routine.</h2><p>The action feels immediate, but the interface stays honest until the server confirms it.</p><button className="primary" disabled={saving} onClick={save}>{saving?'Saving…':'Simulate save'}</button></div>}

      {active==='Success'&&<div className="stateInlineCard success"><div className="stateMark">✓</div><span className="eyebrow">All set</span><h2>Your routine is up to date.</h2><p>Today’s progress is reflected across Journey, challenges, and rewards.</p><button className="primary" onClick={()=>setActive('Loading')}>Preview again</button></div>}
    </section>

    <section className="statePrinciples"><article><span>01</span><h3>Never fake success</h3><p>Subscription and account mutations wait for authoritative confirmation.</p></article><article><span>02</span><h3>Preserve context</h3><p>Errors explain what happened without dumping the member out of the flow.</p></article><article><span>03</span><h3>Use last-known-good data</h3><p>Stale data is labeled rather than replaced with blank screens.</p></article></section>
    <a className="stateBackLink" href="/">← Back to My Dose</a>
  </div>;
}
