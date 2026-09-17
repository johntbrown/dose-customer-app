'use client';

import { useMemo, useState } from 'react';

const LIVER='https://cdn.shopify.com/s/files/1/0348/3317/0477/files/liver-alt-media-bottle-no-badge.png?v=1770661532&width=900';

const circleSeed=[
  {name:'John',status:'Taken today',streak:18,you:true},
  {name:'Mike',status:'Taken today',streak:12},
  {name:'Sarah',status:'Not logged yet',streak:8},
];

export default function MemberPortal({name='John',streak=6,points=1240,cashback=5,onNavigate}){
  const [section,setSection]=useState('Overview');
  const [connected,setConnected]=useState({health:false,watch:false,calendar:true,notifications:true,siri:false});
  const [cheered,setCheered]=useState({});
  const tier=useMemo(()=>points>=3000?'Gold':points>=1500?'Silver':'Bronze',[points]);
  const nextTier=tier==='Bronze'?'Silver':tier==='Silver'?'Gold':null;
  const tabs=['Overview','Rewards','Wellness','Circle','Connected','Account'];

  const Overview=()=> <>
    <section className="youHero"><div><span className="portalKicker">Your membership</span><h1>Everything about<br/>your Dose.</h1><p>Manage your plan, benefits, support, wellness profile, connected routine, and member settings in one place.</p></div><div className="youAvatar">J</div></section>
    <section className="youStats"><div><span>Current streak</span><strong>{streak} days</strong></div><div><span>Reward points</span><strong>{points.toLocaleString()}</strong></div><div><span>Member level</span><strong>{tier}</strong></div></section>
    <section className="youPriorityGrid">
      <button onClick={()=>onNavigate?.('Plan')}><span className="portalKicker">Subscription</span><strong>Next delivery September 28</strong><small>1 bottle every 24 days</small><b>Manage plan</b></button>
      <button onClick={()=>setSection('Wellness')}><span className="portalKicker">Wellness profile</span><strong>Personalize your experience</strong><small>Goals, routine check-ins, and support preferences</small><b>Open profile</b></button>
      <button onClick={()=>setSection('Rewards')}><span className="portalKicker">Rewards</span><strong>${cashback} available</strong><small>{points.toLocaleString()} points · {tier} member</small><b>View rewards</b></button>
      <button onClick={()=>setSection('Connected')}><span className="portalKicker">Connected routine</span><strong>Meet Dose where you are</strong><small>Apple Health, Watch, reminders, calendar, and Siri concepts</small><b>Manage connections</b></button>
    </section>
    <section className="youPlanCard"><img src={LIVER} alt="Dose for your Liver"/><div><span className="portalKicker">Your subscription</span><h2>Dose for your Liver</h2><p>Next delivery September 28 · $63.00 every 24 days</p><button className="portalPrimary" onClick={()=>onNavigate?.('Plan')}>Manage subscription</button></div></section>
    <section className="youSupportCard"><div><span className="portalKicker">Member support</span><h2>Get human help when you need it.</h2><p>Concierge, clinical nutritionist, phone, email, and chat should all feel like one support system.</p></div><div className="youSupportActions"><button>Book concierge</button><button>Book nutritionist</button><a href="tel:8884543320">Call Dose</a></div></section>
  </>;

  const Rewards=()=> <>
    <section className="youSectionHero"><span className="portalKicker">Rewards</span><h1>Your routine<br/>pays you back.</h1><p>Rewards reinforce useful behaviors but never outrank payment, order, or support issues.</p></section>
    <section className="youRewardHero"><div className={`youTierBadge ${tier.toLowerCase()}`}>{tier[0]}</div><div><span>Member level</span><h2>{tier}</h2><p>{nextTier?`${Math.max(0,(tier==='Bronze'?1500:3000)-points).toLocaleString()} points to ${nextTier}.`:'Current top prototype tier.'}</p></div></section>
    <section className="youStats"><div><span>Points</span><strong>{points.toLocaleString()}</strong></div><div><span>Cash back</span><strong>${cashback}</strong></div><div><span>Streak</span><strong>{streak} days</strong></div></section>
    <section className="youListCard"><button onClick={()=>onNavigate?.('Rewards')}><span><strong>Badges & milestone gifts</strong><small>See unlocked and upcoming benefits</small></span><b>Open</b></button><button onClick={()=>onNavigate?.('Journey')}><span><strong>Challenges</strong><small>7-, 21-, and 90-day progress goals</small></span><b>View</b></button><button><span><strong>Referral</strong><small>Give $40. Get $40.</small></span><b>Invite</b></button></section>
  </>;

  const Wellness=()=> <>
    <section className="youSectionHero"><span className="portalKicker">Wellness profile</span><h1>Make My Dose<br/>feel more like yours.</h1><p>Use optional goals and check-ins to shape education, services, reminders, and next-best actions.</p></section>
    <section className="youWellnessCard"><div><span className="portalKicker">Goals</span><h2>Support my liver health</h2><p>Preferred support: simple daily routine · measurable progress over time.</p></div><button className="portalPrimary" onClick={()=>onNavigate?.('Wellness')}>Open wellness profile</button></section>
    <section className="youListCard"><button onClick={()=>onNavigate?.('Wellness')}><span><strong>Wellness goals quiz</strong><small>Update priorities and support style</small></span><b>Open</b></button><button onClick={()=>onNavigate?.('Wellness')}><span><strong>Routine check-in</strong><small>Tell us how consistency and confidence are going</small></span><b>Check in</b></button><button onClick={()=>onNavigate?.('Journey')}><span><strong>Journal & insights</strong><small>Review optional self-reports and trends</small></span><b>View Journey</b></button></section>
  </>;

  const Circle=()=> <>
    <section className="youSectionHero"><span className="portalKicker">Dose Circle</span><h1>Accountability<br/>without oversharing.</h1><p>Small, opt-in circles show only the routine status a member chooses to share. Wellness and health details stay private.</p></section>
    <section className="youCircleCard"><div className="youCircleHead"><div><span className="portalKicker">John’s Circle</span><h2>3 members</h2></div><button>Invite someone</button></div>{circleSeed.map(m=><article key={m.name}><div className="youCircleAvatar">{m.name[0]}</div><div><strong>{m.name}{m.you?' · You':''}</strong><small>{m.streak}-day streak · {m.status}</small></div>{m.you?null:<button onClick={()=>setCheered({...cheered,[m.name]:true})}>{cheered[m.name]?'Encouraged':'Send encouragement'}</button>}</article>)}</section>
    <section className="youBonus"><span className="portalKicker">Circle bonus</span><h2>18 / 25 combined routine days</h2><p>Hit the shared weekly target and everyone earns a small bonus.</p><div><i style={{width:'72%'}}/></div></section>
  </>;

  const Connected=()=> <>
    <section className="youSectionHero"><span className="portalKicker">Connected routine</span><h1>Dose beyond<br/>the app.</h1><p>Native integrations can reduce friction around reminders and logging. These controls remain prototype concepts until the native architecture is approved.</p></section>
    <section className="youConnectionList">{[
      ['health','Apple Health','Optional activity and sleep context'],
      ['watch','Apple Watch','Quick routine logging from your wrist'],
      ['calendar','Calendar','Order, appointment, and check-in reminders'],
      ['notifications','Actionable notifications','Taken, Later, or Skip from the notification'],
      ['siri','Siri + Shortcuts','“Hey Siri, log my Dose.”'],
    ].map(([key,title,copy])=><article key={key}><div><strong>{title}</strong><small>{copy}</small></div><button aria-pressed={connected[key]} className={connected[key]?'youToggle on':'youToggle'} onClick={()=>setConnected({...connected,[key]:!connected[key]})}><i/></button></article>)}</section>
    <p className="youFine">Apple Health, Watch, Siri, widgets, and notification actions require native capabilities, explicit permission, privacy review, and data-minimization rules.</p>
  </>;

  const Account=()=> <>
    <section className="youSectionHero"><span className="portalKicker">Account & support</span><h1>Control the<br/>relationship.</h1><p>Subscription, communication preferences, privacy controls, and human support belong together here.</p></section>
    <section className="youListCard"><button onClick={()=>onNavigate?.('Plan')}><span><strong>Subscription & next order</strong><small>Cadence, next delivery, quantity, and approved changes</small></span><b>Manage</b></button><button><span><strong>Reminder preferences</strong><small>Choose when and where Dose can remind you</small></span><b>Edit</b></button><button><span><strong>Privacy & connected data</strong><small>Review optional wellness and integration permissions</small></span><b>Review</b></button><button><span><strong>Communication preferences</strong><small>Email, SMS, and app notification settings</small></span><b>Edit</b></button></section>
    <section className="youSupportCard"><div><span className="portalKicker">We’re here for you</span><h2>Need help?</h2><p>Text or call (888) 454-3320, email weactuallycare@dosedaily.co, or start a chat.</p></div><div className="youSupportActions"><a href="tel:8884543320">Call</a><a href="mailto:weactuallycare@dosedaily.co">Email</a><button>Chat</button></div></section>
  </>;

  const screens={Overview:<Overview/>,Rewards:<Rewards/>,Wellness:<Wellness/>,Circle:<Circle/>,Connected:<Connected/>,Account:<Account/>};

  return <div className="portalPage youHub">
    <nav className="youTabs" aria-label="Member area">{tabs.map(tab=><button key={tab} className={section===tab?'active':''} onClick={()=>{setSection(tab);window.scrollTo({top:0,behavior:'smooth'})}}>{tab}</button>)}</nav>
    {screens[section]}
  </div>;
}
