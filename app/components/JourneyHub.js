'use client';

import { useMemo, useState } from 'react';

const seedActivity = [
  {id:'seed-1',date:'Sep 16',type:'Wellness',title:'Wellness check-in',detail:'Energy: Good · Digestion: Good'},
  {id:'seed-2',date:'Sep 15',type:'Learn',title:'Masterclass progress',detail:'Month 1 expectations'},
  {id:'seed-3',date:'Sep 14',type:'Order',title:'Shipment update',detail:'Dose for your Liver is in transit'},
];

const circleMembers = [
  {name:'John',streak:18,status:'Taken today',you:true},
  {name:'Mike',streak:12,status:'Taken today'},
  {name:'Sarah',streak:8,status:'Not logged yet'},
];

function eventDateLabel(value){
  if(!value) return 'Today';
  try{return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'}).format(new Date(value));}catch{return 'Today'}
}

export default function JourneyHub({member, derived, progressEvents=[], points=0}) {
  const [tab,setTab]=useState('Overview');
  const [selectedDay,setSelectedDay]=useState(Math.min(derived?.journeyDay || member?.lifecycle?.day || 1,90));
  const [filter,setFilter]=useState('All');
  const [joined,setJoined]=useState({kickstart:true,builder:false,master:true,journey90:true});
  const [cheered,setCheered]=useState({});
  const [journal,setJournal]=useState({energy:'Good',digestion:'Good',sleep:'7–8 hours'});
  const [saved,setSaved]=useState(false);

  const lifecycleDay=derived?.journeyDay||member?.lifecycle?.day||1;
  const currentStreak=derived?.streak||member?.routine?.streak_days||0;
  const completedDays=Math.min(lifecycleDay,90);
  const consistency=Math.min(96,Math.max(62,Math.round((currentStreak/Math.max(7,Math.min(completedDays,30)))*100)));
  const days=useMemo(()=>Array.from({length:90},(_,i)=>{
    const day=i+1;
    const isToday=day===completedDays;
    return {
      day,
      past:day<=completedDays,
      taken:day<completedDays?((i%7)!==2):(isToday?Boolean(derived?.takenToday):false),
      checkin:day<=completedDays&&i%9===0,
      lesson:day===5||day===13||day===29,
      milestone:[7,24,48,72,90].includes(day),
      today:isToday,
    };
  }),[completedDays,derived?.takenToday]);

  const activity=useMemo(()=>{
    const live=(progressEvents||[]).map(e=>({id:e.id,date:eventDateLabel(e.occurredAt),type:e.type,title:e.title,detail:e.detail}));
    return [...live,...seedActivity];
  },[progressEvents]);
  const filtered=filter==='All'?activity:activity.filter(a=>a.type===filter);
  const tabs=['Overview','Insights','Challenges','Circle','Report'];
  const challenges=derived?.challenges||[];

  const Overview=()=> <>
    <section className="simpleHero journeyHero"><span className="eyebrow">Journey</span><h1>Your first 90 days,<br/>made visible.</h1><p>Every useful action now feeds the same progress story, from today’s routine to education, challenges, orders, and milestones.</p></section>
    <section className="journeySummary"><div><span>Consistency</span><strong>{consistency}%</strong><small>last 30 days</small></div><div><span>Current streak</span><strong>{currentStreak}</strong><small>days</small></div><div><span>Journey day</span><strong>{lifecycleDay}</strong><small>since starting</small></div></section>
    <section className="featureCard calendarFeature"><div className="featureCardHead"><div><span className="featureEyebrow">90-day calendar</span><h2>Watch the story fill in.</h2></div><div className="calendarLegend"><span><i className="legendTaken"/>Taken</span><span><i className="legendCheck"/>Check-in</span><span><i className="legendMilestone"/>Milestone</span></div></div>
      <div className="calendarMonthLabel"><span>Days 1–30</span><span>Days 31–60</span><span>Days 61–90</span></div>
      <div className="heatmap">{days.map(d=><button key={d.day} aria-label={`Day ${d.day}${d.taken?', Dose taken':''}${d.checkin?', check-in':''}${d.milestone?', milestone':''}${d.today?', current day':''}`} onClick={()=>setSelectedDay(d.day)} className={`${d.taken?'taken ':''}${d.checkin?'checkin ':''}${d.milestone?'milestone ':''}${d.today?'today ':''}${selectedDay===d.day?'selected':''}`}>{d.day}</button>)}</div>
      <div className="dayDetail"><div><span>Day {selectedDay}</span><strong>{selectedDay===lifecycleDay?'Today in your journey':selectedDay<=completedDays?'Your activity':'Upcoming journey day'}</strong></div><p>{selectedDay===lifecycleDay?`${derived?.takenToday?'Dose logged':'Dose not logged yet'} · ${currentStreak}-day streak · progress updates everywhere instantly.`:selectedDay<=completedDays?'Routine and milestone history recorded for this day.':'Keep building your routine to unlock this day.'}</p></div>
    </section>
    <div className="featureSectionHead"><div><span className="featureEyebrow">History</span><h2>Everything that moved you forward.</h2></div></div>
    <div className="filterRow">{['All','Dose','Wellness','Learn','Order','Rewards'].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x}</button>)}</div>
    <section className="historyList">{filtered.map(a=><article key={a.id||a.date+a.title}><span>{a.date}</span><div><b>{a.type}</b><strong>{a.title}</strong><small>{a.detail}</small></div></article>)}</section>
  </>;

  const Insights=()=> <>
    <section className="simpleHero"><span className="eyebrow">Insights</span><h1>Turn consistency<br/>into perspective.</h1><p>Trends add context without turning wellness data into diagnosis or claiming that Dose caused a change.</p></section>
    <section className="insightGrid"><article><span>30-day consistency</span><strong>{consistency}%</strong><div className="sparkBars">{[62,68,72,75,79,82,consistency].map((x,i)=><i key={i} style={{height:`${x}%`}}/>)}</div><small>Routine trend</small></article><article><span>Education</span><strong>{derived?.lessonCount||member.education.completed_modules}/{member.education.total_modules}</strong><div className="trendLine"><i style={{width:`${Math.round((derived?.lessonCount||member.education.completed_modules)/member.education.total_modules*100)}%`}}/></div><small>Masterclass complete</small></article><article><span>Average sleep</span><strong>7h 18m</strong><div className="trendLine"><i style={{width:'74%'}}/></div><small>Illustrative member-authorized data</small></article><article><span>Daily steps</span><strong>8,240</strong><div className="trendLine"><i style={{width:'82%'}}/></div><small>Illustrative wearable context</small></article></section>
    <section className="featureCard"><div className="featureCardHead"><div><span className="featureEyebrow">Wellness journal</span><h2>How are you feeling today?</h2></div><span className="twoMin">30 sec</span></div><div className="journalGrid">{[['energy','Energy',['Low','Okay','Good','Great']],['digestion','Digestion',['Off','Okay','Good','Great']],['sleep','Sleep',['< 6 hours','6–7 hours','7–8 hours','8+ hours']]].map(([key,label,opts])=><div key={key}><span>{label}</span><div>{opts.map(o=><button className={journal[key]===o?'active':''} onClick={()=>{setJournal({...journal,[key]:o});setSaved(false)}} key={o}>{o}</button>)}</div></div>)}</div><button className="featurePrimary" onClick={()=>setSaved(true)}>{saved?'Check-in saved':'Save today’s check-in'}</button><p className="featureFine">Optional self-reported wellness data. Production use requires approved consent, storage, privacy, and analytics boundaries.</p></section>
    <section className="patternCard"><span className="featureEyebrow">Your pattern</span><h2>Your most consistent weeks also had your highest reported energy.</h2><p>Descriptive correlation only. This does not establish that Dose caused the change.</p></section>
  </>;

  const Challenges=()=> <><section className="simpleHero"><span className="eyebrow">Challenges</span><h1>Give progress<br/>something to aim at.</h1><p>Challenge progress now updates from the same actions that drive your streak, Journey, and Rewards.</p></section><section className="challengeGrid">{challenges.map(c=>{const pct=c.progress||0;return <article className={c.complete?'challengeComplete':''} key={c.id}><span className="featureEyebrow">{c.source==='lessons'?'Education':`${c.target}-day challenge`}</span><h2>{c.title}</h2><div className="challengeMeter"><i style={{width:`${pct}%`}}/></div><small>{Math.min(c.value,c.target)}/{c.target} complete · {c.reward}</small><button onClick={()=>setJoined({...joined,[c.id]:!joined[c.id]})}>{c.complete?'Completed ✓':joined[c.id]?'Joined ✓':'Join challenge'}</button></article>})}</section></>;

  const Circle=()=> <><section className="simpleHero"><span className="eyebrow">Dose Circle</span><h1>Accountability,<br/>kept private.</h1><p>Small opt-in groups can share routine status and encouragement without exposing health details.</p></section><section className="featureCard"><div className="featureCardHead"><div><span className="featureEyebrow">John’s Circle</span><h2>3 members</h2></div><button className="featureSecondary">Invite someone</button></div><div className="circleList">{circleMembers.map(m=><article key={m.name}><div className="circleAvatar">{m.name[0]}</div><div><strong>{m.name}{m.you?' · You':''}</strong><span>{m.you?currentStreak:m.streak}-day streak · {m.you?(derived?.takenToday?'Taken today':'Not logged yet'):m.status}</span></div>{m.you?null:<button onClick={()=>setCheered({...cheered,[m.name]:true})}>{cheered[m.name]?'Cheered ✓':'Send encouragement'}</button>}</article>)}</div></section><section className="circleBonus"><span className="featureEyebrow">Circle bonus</span><h2>Complete 5 days together this week.</h2><p>Shared consistency can unlock a small bonus without revealing medical or wellness data.</p><div className="challengeMeter"><i style={{width:'72%'}}/></div><small>18 / 25 combined routine days</small></section></>;

  const Report=()=> <><section className="simpleHero"><span className="eyebrow">90-Day Report</span><h1>Make three months<br/>feel tangible.</h1><p>A member-controlled summary of routine, education, milestones, optional wellness trends, and wearable context.</p></section><section className="reportSheet"><div className="reportTitle"><span>John’s first 90 days</span><strong>My Dose</strong></div><div className="reportMetrics"><div><span>Routine consistency</span><strong>{consistency}%</strong></div><div><span>Current streak</span><strong>{currentStreak} days</strong></div><div><span>Journey day</span><strong>{lifecycleDay}</strong></div><div><span>Masterclass</span><strong>{derived?.lessonCount||member.education.completed_modules}/{member.education.total_modules}</strong></div></div><div className="reportSection"><span>Member progress</span><div className="reportRows"><p><b>Points</b><strong>{points.toLocaleString()}</strong></p><p><b>Primary product</b><strong>{member.product.primary_product}</strong></p><p><b>Order status</b><strong>{member.order.status.replaceAll('_',' ')}</strong></p></div></div><div className="reportActions"><button>Download report</button><button>Share with nutritionist</button><button>Share with doctor</button></div><small>Prototype report. Sharing must be member initiated. Wellness data is descriptive and should not be interpreted as diagnosis, treatment, or proof of causation.</small></section></>;

  const screens={Overview:<Overview/>,Insights:<Insights/>,Challenges:<Challenges/>,Circle:<Circle/>,Report:<Report/>};
  return <div className="page journeyIntegrated"><nav className="journeySubnav" aria-label="Journey sections">{tabs.map(x=><button key={x} onClick={()=>{setTab(x);window.scrollTo({top:0,behavior:'smooth'})}} className={tab===x?'active':''}>{x}</button>)}</nav>{screens[tab]}</div>;
}
