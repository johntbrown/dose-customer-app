'use client';
import { useMemo, useState } from 'react';

const challengeSeed=[
 {id:'kickstart',title:'7-Day Kickstart',days:7,done:5,reward:'150 points',copy:'Build a simple daily rhythm and finish your first consistency challenge.'},
 {id:'builder',title:'21-Day Routine Builder',days:21,done:12,reward:'Routine Builder badge',copy:'Stay consistent for at least 18 of 21 days and strengthen the habit.'},
 {id:'master',title:'Master Your Dose',days:3,done:1,reward:'Dose Scholar badge',copy:'Complete all three Masterclass lessons and unlock the education milestone.'},
 {id:'journey90',title:'90-Day Journey',days:90,done:18,reward:'Milestone gift',copy:'Build toward the first major retention milestone with progress you can see.'}
];

const activity=[
 {date:'Sep 15',type:'Dose',title:'Daily Dose completed',detail:'Logged at 8:06 AM · 18-day streak'},
 {date:'Sep 14',type:'Wellness',title:'Energy check-in',detail:'Energy: Good · Digestion: Good · Sleep: 7h 21m'},
 {date:'Sep 13',type:'Learn',title:'Masterclass lesson completed',detail:'What to expect in Month 1 · +25 points'},
 {date:'Sep 12',type:'Order',title:'Shipment update',detail:'Dose for your Liver is in transit'},
 {date:'Sep 11',type:'Rewards',title:'7-Day Starter unlocked',detail:'Badge earned · +100 bonus points'},
 {date:'Sep 10',type:'Dose',title:'Daily Dose completed',detail:'Logged at 7:52 AM'},
];

const circleMembers=[
 {name:'John',streak:18,status:'Taken today',you:true},
 {name:'Mike',streak:12,status:'Taken today'},
 {name:'Sarah',streak:8,status:'Not logged yet'},
];

export default function FeatureHub(){
 const [tab,setTab]=useState('Journey');
 const [selectedDay,setSelectedDay]=useState(18);
 const [filter,setFilter]=useState('All');
 const [joined,setJoined]=useState({kickstart:true,builder:false,master:true,journey90:true});
 const [cheered,setCheered]=useState({});
 const [integrations,setIntegrations]=useState({health:true,watch:true,siri:false,calendar:true,notifications:true,widget:false});
 const [journal,setJournal]=useState({energy:'Good',digestion:'Good',sleep:'7–8 hours',note:''});
 const [journalSaved,setJournalSaved]=useState(false);
 const days=useMemo(()=>Array.from({length:90},(_,i)=>({day:i+1,taken:(i%7)!==2,checkin:i%9===0,lesson:i===4||i===12||i===28,reward:i===6||i===23||i===71})),[]);
 const filtered=filter==='All'?activity:activity.filter(a=>a.type===filter);
 const tabs=['Journey','Insights','Challenges','Circle','Everywhere','Report'];

 const Journey=()=> <>
  <section className="featureHero"><span className="featureEyebrow">My Journey</span><h1>Your first 90 days,<br/>in one place.</h1><p>A visual record of consistency, learning, wellness check-ins, shipments, rewards, and milestones.</p></section>
  <section className="journeySummary"><div><span>Consistency</span><strong>83%</strong><small>15 of 18 days</small></div><div><span>Current streak</span><strong>18</strong><small>days</small></div><div><span>Milestones</span><strong>3</strong><small>unlocked</small></div></section>
  <section className="featureCard"><div className="featureCardHead"><div><span className="featureEyebrow">90-day calendar</span><h2>See the journey build.</h2></div><div className="calendarLegend"><span><i className="legendTaken"/>Taken</span><span><i className="legendCheck"/>Check-in</span><span><i className="legendMilestone"/>Milestone</span></div></div><div className="heatmap">{days.map(d=><button key={d.day} aria-label={`Day ${d.day}`} onClick={()=>setSelectedDay(d.day)} className={`${d.taken?'taken ':''}${d.checkin?'checkin ':''}${d.reward?'milestone ':''}${selectedDay===d.day?'selected':''}`}>{d.day}</button>)}</div><div className="dayDetail"><div><span>Day {selectedDay}</span><strong>{selectedDay<=18?'Your activity':'Upcoming journey day'}</strong></div><p>{selectedDay===18?'Dose taken at 8:06 AM · 7h 21m sleep · 8,432 steps · Energy: Good':selectedDay<=18?'Dose logged · Journey activity recorded':'Keep building your routine to unlock this day.'}</p></div></section>
  <div className="featureSectionHead"><div><span className="featureEyebrow">History</span><h2>Everything that moved your journey forward.</h2></div></div>
  <div className="filterRow">{['All','Dose','Wellness','Learn','Order','Rewards'].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x}</button>)}</div>
  <section className="historyList">{filtered.map(a=><article key={a.date+a.title}><span>{a.date}</span><div><b>{a.type}</b><strong>{a.title}</strong><small>{a.detail}</small></div></article>)}</section>
 </>;

 const Insights=()=> <>
  <section className="featureHero"><span className="featureEyebrow">Insights</span><h1>Turn consistency<br/>into perspective.</h1><p>Combine routine behavior, optional wellness check-ins, and member-authorized wearable context into simple trends.</p></section>
  <section className="insightGrid"><article><span>30-day consistency</span><strong>87%</strong><div className="sparkBars">{[62,72,68,78,82,80,87].map((x,i)=><i key={i} style={{height:`${x}%`}}/>)}</div><small>+9 pts vs prior 30 days</small></article><article><span>Average sleep</span><strong>7h 18m</strong><div className="trendLine"><i style={{width:'74%'}}/></div><small>+24 min vs prior month</small></article><article><span>Daily steps</span><strong>8,240</strong><div className="trendLine"><i style={{width:'82%'}}/></div><small>Member-authorized wearable data</small></article><article><span>Check-in trend</span><strong>Energy ↑</strong><div className="trendLine"><i style={{width:'76%'}}/></div><small>Self-reported, not a clinical measure</small></article></section>
  <section className="featureCard"><div className="featureCardHead"><div><span className="featureEyebrow">Wellness journal</span><h2>How are you feeling today?</h2></div><span className="twoMin">30 sec</span></div><div className="journalGrid">{[['energy','Energy',['Low','Okay','Good','Great']],['digestion','Digestion',['Off','Okay','Good','Great']],['sleep','Sleep',['< 6 hours','6–7 hours','7–8 hours','8+ hours']]].map(([key,label,opts])=><div key={key}><span>{label}</span><div>{opts.map(o=><button className={journal[key]===o?'active':''} onClick={()=>{setJournal({...journal,[key]:o});setJournalSaved(false)}} key={o}>{o}</button>)}</div></div>)}</div><textarea value={journal.note} onChange={e=>{setJournal({...journal,note:e.target.value});setJournalSaved(false)}} placeholder="Optional note about today..."/><button className="featurePrimary" onClick={()=>setJournalSaved(true)}>{journalSaved?'Check-in saved':'Save today’s check-in'}</button><p className="featureFine">Wellness entries in this prototype are optional self-reports. They should not be interpreted as medical outcomes.</p></section>
  <section className="patternCard"><span className="featureEyebrow">Your pattern</span><h2>Your most consistent weeks also had your highest reported energy.</h2><p>This is a descriptive correlation in the prototype, not evidence that Dose caused the change.</p></section>
 </>;

 const Challenges=()=> <>
  <section className="featureHero"><span className="featureEyebrow">Dose Challenges</span><h1>Give progress<br/>something to aim at.</h1><p>Short, useful challenges turn badges and rewards into active goals instead of passive collectibles.</p></section>
  <section className="challengeGrid">{challengeSeed.map(c=>{const pct=Math.min(100,Math.round(c.done/c.days*100));return <article key={c.id}><span className="featureEyebrow">{c.days===3?'Education challenge':`${c.days}-day challenge`}</span><h2>{c.title}</h2><p>{c.copy}</p><div className="challengeMeter"><i style={{width:`${pct}%`}}/></div><small>{c.done}/{c.days} complete · {c.reward}</small><button onClick={()=>setJoined({...joined,[c.id]:!joined[c.id]})}>{joined[c.id]?'Joined ✓':'Join challenge'}</button></article>})}</section>
 </>;

 const Circle=()=> <>
  <section className="featureHero"><span className="featureEyebrow">Dose Circle</span><h1>Better together,<br/>still private.</h1><p>Small, opt-in accountability circles for people you actually know. Health details stay private unless a member explicitly chooses to share them.</p></section>
  <section className="featureCard"><div className="featureCardHead"><div><span className="featureEyebrow">John’s Circle</span><h2>3 members</h2></div><button className="featureSecondary">Invite someone</button></div><div className="circleList">{circleMembers.map(m=><article key={m.name}><div className="circleAvatar">{m.name[0]}</div><div><strong>{m.name}{m.you?' · You':''}</strong><span>{m.streak}-day streak · {m.status}</span></div>{m.you?null:<button onClick={()=>setCheered({...cheered,[m.name]:true})}>{cheered[m.name]?'Cheered ✓':'Send encouragement'}</button>}</article>)}</div></section>
  <section className="circleBonus"><span className="featureEyebrow">Circle bonus</span><h2>Complete 5 days together this week.</h2><p>When everyone in your Circle hits the shared consistency target, each member earns a small bonus.</p><div className="challengeMeter"><i style={{width:'72%'}}/></div><small>18 / 25 combined routine days</small></section>
 </>;

 const Everywhere=()=> <>
  <section className="featureHero"><span className="featureEyebrow">Dose Everywhere</span><h1>Your routine shouldn’t<br/>depend on opening an app.</h1><p>Prototype surfaces for notifications, widgets, Apple Watch, Siri, Shortcuts, and calendar reminders.</p></section>
  <section className="devicePreviewGrid"><article className="phoneWidget"><span>My Dose</span><strong>18-day streak</strong><p>Take today’s Dose</p><button>Taken</button></article><article className="notificationMock"><span>8:00 AM · My Dose</span><strong>Time for your Dose</strong><p>Keep your 18-day streak going.</p><div><button>Taken</button><button>Later</button></div></article></section>
  <section className="featureCard"><div className="featureCardHead"><div><span className="featureEyebrow">Connected routine</span><h2>Choose where Dose can meet you.</h2></div></div><div className="integrationList">{[
   ['health','Apple Health','Use member-authorized activity and sleep context.'],['watch','Apple Watch','Quick routine check-in from your wrist.'],['siri','Siri + Shortcuts','“Hey Siri, log my Dose.”'],['calendar','Calendar','Add renewal, shipment, check-in, and appointment reminders.'],['notifications','Actionable notifications','Taken, remind later, or skip directly from the notification.'],['widget','Home / lock-screen widget','See streak and log today without opening the app.']
  ].map(([key,title,copy])=><article key={key}><div><strong>{title}</strong><span>{copy}</span></div><button aria-pressed={integrations[key]} onClick={()=>setIntegrations({...integrations,[key]:!integrations[key]})} className={integrations[key]?'toggle on':'toggle'}><i/></button></article>)}</div><p className="featureFine">HealthKit, Watch, Siri, widgets, and actionable notifications require native platform capabilities and explicit permissions. These controls are simulated.</p></section>
 </>;

 const Report=()=> <>
  <section className="featureHero"><span className="featureEyebrow">90-Day Wellness Report</span><h1>Make three months<br/>feel tangible.</h1><p>A shareable summary of routine consistency, education, milestones, self-reported wellness, and optional wearable context.</p></section>
  <section className="reportSheet"><div className="reportTitle"><span>John’s first 90 days</span><strong>My Dose</strong></div><div className="reportMetrics"><div><span>Routine consistency</span><strong>83%</strong></div><div><span>Longest streak</span><strong>27 days</strong></div><div><span>Dose taken</span><strong>75 / 90</strong></div><div><span>Masterclass</span><strong>3 / 3</strong></div></div><div className="reportSection"><span>Wellness check-ins</span><div className="reportRows"><p><b>Energy</b><strong>Trending up</strong></p><p><b>Digestion</b><strong>Improved self-report</strong></p><p><b>Sleep</b><strong>7h 18m avg</strong></p></div></div><div className="reportSection"><span>Milestones</span><p>4 badges · Silver Member · Travel Case milestone unlocked</p></div><div className="reportActions"><button>Download report</button><button>Share with nutritionist</button><button>Share with doctor</button></div><small>Prototype report. Wellness and wearable information is descriptive and should not be presented as diagnosis, treatment, or proof of causation.</small></section>
 </>;

 const screens={Journey:<Journey/>,Insights:<Insights/>,Challenges:<Challenges/>,Circle:<Circle/>,Everywhere:<Everywhere/>,Report:<Report/>};
 return <main className="featureShell"><header className="featureTop"><a href="/" className="featureLogo">Dose</a><span>John · Member</span><a href="/">Back to My Dose</a></header><nav className="featureTabs">{tabs.map(x=><button key={x} onClick={()=>{setTab(x);window.scrollTo({top:0,behavior:'smooth'})}} className={tab===x?'active':''}>{x}</button>)}</nav><div className="featurePage">{screens[tab]}</div></main>
}
