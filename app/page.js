'use client';

import { useMemo, useState } from 'react';
import MemberPortal from './components/MemberPortal';
import PrioritizedToday from './components/PrioritizedToday';
import JourneyHub from './components/JourneyHub';
import CelebrationBurst from './components/CelebrationBurst';
import BadgeUnlockTakeover from './components/BadgeUnlockTakeover';
import MilestoneCelebration from './components/MilestoneCelebration';
import LeadershipDemoPanel from './components/LeadershipDemoPanel';
import { getDemoMemberState } from './lib/memberState';
import { getHomeDecision } from './lib/homePriority';
import usePersistentProgress from './lib/usePersistentProgress';
import { getDerivedProgress, getNewUnlocks, makeProgressEvent, BADGES } from './lib/progressEngine';
import { trackPrototypeEvent, eventNames } from './lib/analytics';

const LIVER='https://cdn.shopify.com/s/files/1/0348/3317/0477/files/liver-alt-media-bottle-no-badge.png?v=1770661532&width=900';
const LIVER_LIFE='https://dosedaily.co/cdn/shop/files/liver-home-product-section-up_900x.jpg?v=1613554269';
const CHOL='https://dosedaily.co/cdn/shop/files/cholesterol-alt-media-bottle.png?v=1770054243&width=900';

const tierCatalog=[{name:'Bronze',min:0,max:1499},{name:'Silver',min:1500,max:2999},{name:'Gold',min:3000,max:4999}];
const labels={m1:'Month 1 · Active',risk:'Month 2 · At risk',engaged:'Month 4 · Engaged',payment_failed:'Payment failed'};

const quizzes={
  goals:{title:'Wellness goals',questions:[
    {id:'goal',text:'What is your biggest wellness priority right now?',options:['Support my liver health','Improve everyday energy','Support digestion & less bloating','Keep cholesterol in a healthier range']},
    {id:'style',text:'What kind of support is most useful to you?',options:['A simple daily routine','Short education and tips','Access to an expert when I need it','Progress and numbers I can track']},
    {id:'motivation',text:'What would keep you most motivated?',options:['Seeing my streak grow','Unlocking rewards and gifts','Understanding what to expect','Seeing measurable progress over time']},
  ]},
  routine:{title:'Routine check-in',questions:[
    {id:'consistency',text:'How consistently are you taking Dose?',options:['Every day','Most days','A few days each week','I am having trouble getting started']},
    {id:'confidence',text:'How confident do you feel about your current routine?',options:['Very confident','Mostly confident','I still have a few questions','I need help getting on track']},
    {id:'next',text:'What would be most helpful next?',options:['Keep me accountable','Show me what to expect','Give me a quick education refresher','Connect me with a Dose expert']},
  ]},
};

export default function Home(){
  const [profileKey,setProfileKey]=useState('m1');
  const [page,setPage]=useState('Today');
  const [added,setAdded]=useState(false);
  const [quizMode,setQuizMode]=useState(null);
  const [quizStep,setQuizStep]=useState(0);
  const [quizAnswers,setQuizAnswers]=useState({goals:{},routine:{}});
  const [quizCompleted,setQuizCompleted]=useState({goals:false,routine:false});
  const [badgeCelebration,setBadgeCelebration]=useState(null);
  const [milestoneCelebration,setMilestoneCelebration]=useState(null);
  const {progress,setProgress,resetProgress}=usePersistentProgress();

  const baseMember=useMemo(()=>getDemoMemberState(profileKey),[profileKey]);
  const derived=useMemo(()=>getDerivedProgress(baseMember,progress),[baseMember,progress]);
  const member=useMemo(()=>getDemoMemberState(profileKey,{
    lifecycle:{
      ...baseMember.lifecycle,
      day:derived.journeyDay,
      month:Math.max(1,Math.ceil(derived.journeyDay/24)),
      current_milestone:derived.journeyDay>=90?'day_90':derived.journeyDay>=72?'day_72':derived.journeyDay>=48?'day_48':derived.journeyDay>=24?'day_24':'month_1',
    },
    routine:{today_status:derived.takenToday?'taken':'not_logged',streak_days:derived.streak},
    education:{completed_modules:derived.lessonCount,total_modules:baseMember.education.total_modules,next_module:derived.lessonCount>=3?null:baseMember.education.next_module},
    loyalty:{...baseMember.loyalty,points:derived.points},
  }),[profileKey,baseMember,derived]);

  const decision=useMemo(()=>getHomeDecision(member),[member]);
  const cashback=Math.floor(derived.points/1000)*5;
  const nextReward=Math.ceil((derived.points+1)/500)*500;
  const rewardProgress=Math.min(100,Math.round((derived.points%500)/500*100));
  const unlocked=derived.badgeState.filter(b=>b.unlocked).length;
  const tier=tierCatalog.find(t=>derived.points>=t.min&&derived.points<=t.max)||tierCatalog[2];

  const go=target=>{setPage(target);setQuizMode(null);setQuizStep(0);window.scrollTo({top:0,behavior:'smooth'});};
  const startQuiz=type=>{setPage('Wellness');setQuizMode(type);setQuizStep(0);window.scrollTo({top:0,behavior:'smooth'});};
  const answerQuiz=(type,id,value)=>{const next={...quizAnswers,[type]:{...quizAnswers[type],[id]:value}};setQuizAnswers(next);if(quizStep===quizzes[type].questions.length-1){setQuizCompleted({...quizCompleted,[type]:true});setQuizMode(null);setQuizStep(0);}else setQuizStep(quizStep+1);};

  const commitProgress=(nextProgress,event,options={})=>{
    const before=getDerivedProgress(baseMember,progress);
    const after=getDerivedProgress(baseMember,nextProgress);
    const unlocks=getNewUnlocks(before,after,progress);
    const merged={
      ...nextProgress,
      events:event?[event,...(nextProgress.events||[])].slice(0,30):(nextProgress.events||[]),
      unlockedBadges:Array.from(new Set([...(nextProgress.unlockedBadges||[]),...unlocks.badges.map(b=>b.id)])),
      completedChallenges:Array.from(new Set([...(nextProgress.completedChallenges||[]),...unlocks.challenges.map(c=>c.id)])),
    };
    setProgress(merged);

    if(event) trackPrototypeEvent(options.analyticsEvent||event.type.toLowerCase().replaceAll(' ','_'),{scenario:profileKey,journey_day:after.journeyDay,streak:after.streak,points:after.points});
    if(options.suppressCelebration) return after;

    if(unlocks.badges.length){
      const badge=unlocks.badges[0];
      setBadgeCelebration(badge);
      trackPrototypeEvent(eventNames.badgeUnlocked,{badge_id:badge.id,badge_name:badge.name});
    }else if(unlocks.challenges.length){
      const challenge=unlocks.challenges[0];
      setMilestoneCelebration({variant:'major',eyebrow:'Challenge complete',title:challenge.title,description:'Your progress updated across Journey, Rewards, and your challenge at the same time.',reward:challenge.reward,mark:'✓'});
      trackPrototypeEvent(eventNames.challengeCompleted,{challenge_id:challenge.id});
    }
    return after;
  };

  const toggleDose=()=>{
    const nextTaken=!progress.takenToday;
    const next={...progress,takenToday:nextTaken};
    const event=nextTaken?makeProgressEvent('Dose','Daily Dose completed','Today’s routine was logged and synced across your progress experience.'):null;
    commitProgress(next,event,{analyticsEvent:eventNames.routineLogged});
  };

  const completeLesson=index=>{
    const nextCount=Math.max(progress.lessonCount||baseMember.education.completed_modules,index+1);
    if(nextCount===(progress.lessonCount||baseMember.education.completed_modules)) return;
    const next={...progress,lessonCount:nextCount};
    commitProgress(next,makeProgressEvent('Learn','Masterclass progress',`${nextCount}/3 lessons complete`));
  };

  const submitReview=()=>{
    if(progress.reviewSubmitted) return;
    const next={...progress,reviewSubmitted:true};
    commitProgress(next,makeProgressEvent('Rewards','Community review submitted','Community Voice progress updated'),{analyticsEvent:eventNames.reviewSubmitted});
  };

  const triggerDemo=kind=>{
    trackPrototypeEvent(eventNames.demoScenarioTriggered,{kind});
    if(kind==='risk'){setProfileKey('risk');go('Today');return;}
    if(kind==='payment'){setProfileKey('payment_failed');go('Today');return;}
    if(kind==='review'){go('Rewards');submitReview();return;}
    if(kind==='challenge'){
      setMilestoneCelebration({variant:'major',eyebrow:'Challenge complete',title:'21-Day Routine Builder',description:'Three weeks of consistency is a meaningful behavior milestone, so this moment gets a larger celebration than a normal daily action.',reward:'Routine Builder badge',mark:'21'});
      return;
    }
    const dayMap={day7:7,day24:24,day72:72,day90:90};
    const day=dayMap[kind];
    if(!day) return;
    setProfileKey('m1');
    const next={...progress,journeyOverride:day,takenToday:kind==='day7'?true:progress.takenToday};
    commitProgress(next,makeProgressEvent('Rewards',`Journey Day ${day} reached`,`Leadership demo advanced the journey to Day ${day}.`),{suppressCelebration:true});
    go('Journey');
    if(kind==='day7') setBadgeCelebration(BADGES.find(b=>b.id==='starter'));
    if(kind==='day24') setMilestoneCelebration({variant:'major',eyebrow:'First cycle complete',title:'24 days of showing up',description:'You completed your first full Dose cycle and built a meaningful routine.',reward:'250 bonus points',mark:'24'});
    if(kind==='day72') setMilestoneCelebration({variant:'major',eyebrow:'Order 3 milestone',title:'Your travel case is unlocked',description:'A useful reward for keeping your routine going at home and away.',reward:'Dose Travel Case',mark:'✦'});
    if(kind==='day90') setMilestoneCelebration({variant:'legendary',eyebrow:'90-day milestone',title:'You made 90 days count',description:'Three months of routine, learning, check-ins, and progress now come together in one milestone moment.',reward:'90-Day Wellness Report + milestone gift',mark:'90'});
  };

  const resetDemo=()=>{resetProgress();setProfileKey('m1');setBadgeCelebration(null);setMilestoneCelebration(null);go('Today');};

  const Header=()=> <><header className="appHeader"><button className="logo" onClick={()=>go('Today')}>Dose</button><span className="demoPill">John · Member</span><button className="avatar" onClick={()=>go('You')}>J</button></header><div className="profileSwitch"><span>Demo state</span><select value={profileKey} onChange={e=>{setProfileKey(e.target.value);}}>{Object.entries(labels).map(([key,label])=><option value={key} key={key}>{label}</option>)}</select></div></>;

  const Learn=()=> <div className="page"><section className="simpleHero"><span className="eyebrow">Learn</span><h1>Know your Dose.</h1><p>Product education, expectations, and clinical context in one place.</p></section><section className="learnFeatured"><img src={LIVER_LIFE} alt="Dose for your Liver"/><div><span className="eyebrow">Start here</span><h2>Dose for your Liver</h2><p>Learn how to take it, what’s inside, and how to think about progress over time.</p></div></section><div className="sectionHead"><div><span className="eyebrow">Liver Masterclass</span><h2>Learn in 3 quick steps.</h2></div><span className="lessonReward">+25 pts each</span></div><section className="lessonRail">{['Meet your daily Dose','What to expect in Month 1','How to measure progress'].map((title,i)=>{const complete=i<derived.lessonCount;return <button className={complete?'lessonTile lessonDone':'lessonTile'} key={title} onClick={()=>completeLesson(i)}><div className="lessonCover"><span>0{i+1}</span><small>{complete?'Complete':'Liver health'}</small></div><div><small>Day {i+1} · {i===1?'4':'3'} min</small><strong>{title}</strong><span>{complete?'Complete':'+25 pts · Complete lesson →'}</span></div></button>;})}</section></div>;

  const Orders=()=> <div className="page"><section className="simpleHero"><span className="eyebrow">Orders</span><h1>Know exactly<br/>where it is.</h1><p>Track the order that keeps your routine going.</p></section><section className="trackingCard"><div className="trackingTop"><span className={member.order.shipment_exception?'status':'status live'}>{member.order.shipment_exception?'Needs attention':'In transit'}</span><span>#DOSE-28491</span></div><img src={LIVER} alt="Dose order"/><h2>{member.order.shipment_exception?'Review your shipment':`Arriving ${member.order.eta_label}`}</h2><p>{member.product.primary_product} · 1 bottle</p><div className="trackSteps"><div className="complete"><i>✓</i><span><strong>Order confirmed</strong><small>September 28</small></span></div><div className="complete"><i>✓</i><span><strong>Shipped</strong><small>September 29</small></span></div><div className="active"><i>•</i><span><strong>{member.order.shipment_exception?'Exception':'In transit'}</strong><small>{member.order.shipment_exception?'Tap support if you need help':'On the way to you'}</small></span></div></div><button className="primary spaciousPrimary" onClick={()=>go('Plan')}>Manage next order</button></section></div>;

  const Plan=()=> <div className="page"><section className="simpleHero"><span className="eyebrow">My plan</span><h1>Your routine,<br/>on your terms.</h1><p>Manage the subscription behind your daily habit.</p></section>{member.subscription.payment_status==='failed'&&<section className="wellnessPrompt supportPriority"><div><span className="eyebrow">Payment failed</span><h2>Update payment to protect your next order.</h2><p>This issue intentionally suppresses rewards and product recommendations on Home.</p></div><button>Update payment</button></section>}<section className="planProduct"><div className="productImage"><img src={LIVER} alt="Dose for your Liver"/></div><div><span className="status">{member.subscription.status}</span><h2>{member.product.primary_product}</h2><p>{member.subscription.quantity} bottle every {member.subscription.cadence_days} days</p></div></section><section className="nextOrder"><span className="eyebrow">Next order</span><div><strong>{member.subscription.next_ship_at}</strong><span>Estimated delivery {member.order.eta_label}</span></div><button onClick={()=>go('Orders')}>Track order</button></section></div>;

  const Wellness=()=>{if(quizMode){const q=quizzes[quizMode];const item=q.questions[quizStep];return <div className="page wellnessPage"><button className="quizBack" onClick={()=>{setQuizMode(null);setQuizStep(0);}}>← Back to wellness profile</button><section className="quizRunner"><div className="quizProgress"><i style={{width:`${((quizStep+1)/q.questions.length)*100}%`}}/></div><span className="eyebrow">{q.title} · {quizStep+1} of {q.questions.length}</span><h1>{item.text}</h1><div className="quizOptions">{item.options.map(option=><button key={option} onClick={()=>answerQuiz(quizMode,item.id,option)}>{option}<b>→</b></button>)}</div></section></div>;}
    return <div className="page wellnessPage"><section className="simpleHero"><span className="eyebrow">Your wellness profile</span><h1>Make My Dose<br/>feel more like yours.</h1><p>Short, optional questions help prioritize support, education, and progress experiences.</p></section><section className="quizCards"><article><span className="quizNumber">01</span><h3>Wellness goals</h3><p>Tell us what you care about and what kind of support works best.</p><button onClick={()=>startQuiz('goals')}>{quizCompleted.goals?'Retake quiz':'Start quiz'}</button></article><article><span className="quizNumber">02</span><h3>Routine check-in</h3><p>Tell us how your routine is going and whether you need help.</p><button onClick={()=>startQuiz('routine')}>{quizCompleted.routine?'Retake check-in':'Start check-in'}</button></article></section></div>;};

  const Rewards=()=> <div className="page rewardsPage"><section className="simpleHero rewardsHero"><span className="eyebrow">Dose Rewards</span><h1>Your routine<br/>pays you back.</h1><p>Badges, challenge milestones, and gifts now react to the same progress state as Today and Journey.</p></section><section className="levelCard"><div className={`levelMedal ${tier.name.toLowerCase()}`}>{tier.name[0]}</div><div className="levelCopy"><span className="eyebrow">Member level</span><h2>{tier.name}</h2><p>{derived.points.toLocaleString()} points · ${cashback} available</p></div></section><section className="badgeGrid">{derived.badgeState.map(b=><article className={b.unlocked?'badgeCard unlocked':'badgeCard'} key={b.id}><div className="badgeMedal"><span>{b.unlocked?'✓':b.mark}</span></div><div className="badgeCopy"><span>{b.unlocked?'Unlocked':'In progress'}</span><h3>{b.name}</h3><div className="badgeBar"><i style={{width:`${b.progress}%`}}/></div><small>{Math.min(b.value,b.threshold)}/{b.threshold}</small></div></article>)}</section><section className="celebrationPreviewCard"><div><span className="eyebrow">Leadership preview</span><h3>Preview the badge unlock moment.</h3><p>Use this to show the full-screen celebration without changing the member’s earned state.</p></div><button onClick={()=>setBadgeCelebration(BADGES.find(b=>b.id==='starter'))}>Preview unlock</button></section><section className={`reviewCelebrationCard celebrationStage ${progress.reviewSubmitted?'reviewComplete':''}`}><span className="eyebrow">Community Voice</span><h3>{progress.reviewSubmitted?'Thanks for sharing your experience.':'Share your Dose experience.'}</h3><p>{progress.reviewSubmitted?'Your review is recorded in this prototype, and Community Voice is unlocked.':'Reviews help other members know what to expect. Reward the act of sharing, never the sentiment.'}</p><span className="reviewRewardPill">+100 prototype points</span><div style={{marginTop:16}}><button onClick={submitReview} disabled={progress.reviewSubmitted}>{progress.reviewSubmitted?'Review submitted':'Write a review'}</button></div><CelebrationBurst active={progress.reviewSubmitted} label="Community Voice unlocked" /></section></div>;

  const Discover=()=> <div className="page"><section className="simpleHero"><span className="eyebrow">Recommended for you</span><h1>Relevant, not intrusive.</h1><p>This recommendation is only shown when higher-priority support, payment, and order needs are clear.</p></section><article className="productDiscovery"><div className="productVisual"><span className="recommend">Recommended</span><img src={CHOL} alt="Dose for Cholesterol"/></div><div className="productInfo"><span className="eyebrow">Pairs with your liver routine</span><h2>Dose for Cholesterol</h2><p>Targeted support for healthy cholesterol levels and lipid processing.*</p><div className="productBottom"><div><small>Subscriber add-on</small><strong>From $63 / 24 days</strong></div><button onClick={()=>setAdded(!added)}>{added?'Added':'Add to next order'}</button></div></div></article></div>;

  let content;
  if(page==='Today') content=<PrioritizedToday member={member} decision={decision} currentStreak={derived.streak} points={derived.points} cashback={cashback} unlocked={unlocked} badgeCount={BADGES.length} rewardProgress={rewardProgress} nextReward={nextReward} lessonCount={derived.lessonCount} taken={derived.takenToday} onTaken={toggleDose} onNavigate={go} onWellness={()=>startQuiz(member.check_in?.due?'routine':'goals')}/>;
  else if(page==='Journey') content=<JourneyHub member={member} derived={derived} progressEvents={progress.events} points={derived.points}/>;
  else if(page==='Learn') content=<Learn/>;
  else if(page==='Orders') content=<Orders/>;
  else if(page==='Plan') content=<Plan/>;
  else if(page==='Wellness') content=<Wellness/>;
  else if(page==='Rewards') content=<Rewards/>;
  else if(page==='Discover') content=<Discover/>;
  else content=<MemberPortal name="John" streak={derived.streak} points={derived.points} cashback={cashback} onNavigate={go}/>;

  return <main className="appShell"><Header/>{content}<nav className="bottomNav canonicalNav"><button className={page==='Today'?'active':''} onClick={()=>go('Today')}><span>⌂</span>Today</button><button className={page==='Journey'?'active':''} onClick={()=>go('Journey')}><span>◇</span>Journey</button><button className={page==='Learn'?'active':''} onClick={()=>go('Learn')}><span>□</span>Learn</button><button className={page==='Orders'?'active':''} onClick={()=>go('Orders')}><span>▣</span>Orders</button><button className={['You','Plan','Wellness','Rewards','Discover'].includes(page)?'active':''} onClick={()=>go('You')}><span>○</span>You</button></nav><LeadershipDemoPanel currentDay={derived.journeyDay} onTrigger={triggerDemo} onReset={resetDemo}/><BadgeUnlockTakeover active={Boolean(badgeCelebration)} badge={badgeCelebration} onClose={()=>setBadgeCelebration(null)}/><MilestoneCelebration active={Boolean(milestoneCelebration)} {...milestoneCelebration} onClose={()=>setMilestoneCelebration(null)}/></main>;
}
