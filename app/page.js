'use client';

import { useState } from 'react';

const profiles = {
  m1: { name: 'Alex', month: 'Month 1', label: 'Building the habit', streak: 6, progress: 24, message: 'Consistency matters more than perfection. Keep your daily Dose where you will see it.' },
  risk: { name: 'Sarah', month: 'Month 2', label: 'Getting back on track', streak: 2, progress: 46, message: 'A few missed days are normal. Let’s make your routine easier this week.' },
  engaged: { name: 'Mike', month: 'Month 4', label: 'Keeping momentum', streak: 21, progress: 78, message: 'You’ve built a strong routine. Now is a good time to reflect on what has changed.' }
};

export default function Home() {
  const [profileKey, setProfileKey] = useState('m1');
  const [taken, setTaken] = useState(false);
  const p = profiles[profileKey];

  return (
    <main className="shell">
      <header className="topbar"><div className="brand">DOSE</div><button className="avatar">{p.name[0]}</button></header>
      <section className="demoBar">
        <span>Demo customer</span>
        <select value={profileKey} onChange={(e) => { setProfileKey(e.target.value); setTaken(false); }}>
          <option value="m1">Month 1 · Active</option><option value="risk">Month 2 · At risk</option><option value="engaged">Month 4 · Engaged</option>
        </select>
      </section>
      <section className="hero">
        <p className="eyebrow">MY DOSE · {p.month.toUpperCase()}</p>
        <h1>Good afternoon, {p.name}.</h1>
        <p>{p.label}</p>
      </section>
      <section className="card today">
        <div><p className="eyebrow">TODAY</p><h2>{taken ? 'You took your Dose ✓' : 'Ready for today’s Dose?'}</h2><p>{taken ? `That’s ${p.streak + 1} days in your current streak.` : p.message}</p></div>
        <button className={taken ? 'primary done' : 'primary'} onClick={() => setTaken(!taken)}>{taken ? 'Completed' : 'I took my Dose'}</button>
      </section>
      <section className="grid">
        <article className="card"><p className="eyebrow">YOUR JOURNEY</p><h3>{p.progress}% through this stage</h3><div className="track"><div className="fill" style={{width: `${p.progress}%`}} /></div><button className="link">See my progress →</button></article>
        <article className="card"><p className="eyebrow">NEXT ORDER</p><h3>Coming up soon</h3><p>Your subscription is active. Review your upcoming order or make changes.</p><button className="link">Manage my plan →</button></article>
      </section>
      <section className="card learn"><div><p className="eyebrow">RECOMMENDED FOR YOU</p><h2>What should you expect from consistency?</h2><p>A quick guide to what customers commonly focus on during {p.month.toLowerCase()}.</p></div><button className="secondary">Learn more</button></section>
      <nav><button className="active">Today</button><button>Progress</button><button>Learn</button><button>Rewards</button><button>Account</button></nav>
    </main>
  );
}