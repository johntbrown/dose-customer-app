'use client';

import { useMemo, useState } from 'react';
import MemberPortal from './MemberPortal';
import PrioritizedToday from './PrioritizedToday';
import JourneyHub from './JourneyHub';
import BadgeUnlockTakeover from './BadgeUnlockTakeover';
import MilestoneCelebration from './MilestoneCelebration';
import LeadershipDemoPanel from './LeadershipDemoPanel';
import { LearnScreen, OrdersScreen, PlanScreen, WellnessScreen, RewardsScreen, DiscoverScreen } from './AppScreens';
import { getDemoMemberState } from '../lib/memberState';
import { getHomeDecision } from '../lib/homePriority';
import usePersistentProgress from '../lib/usePersistentProgress';
import { getDerivedProgress, getNewUnlocks, makeProgressEvent, BADGES } from '../lib/progressEngine';
import { trackPrototypeEvent, eventNames } from '../lib/analytics';

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

export default function AppExperience(){
  const [profileKey,setProfileKey]=useState('m1');
  const [page,setPage]=useState('Today');
  const [added,setAdded]=useState(false);
  const [quizMode,setQuizMode]=useState(null);
  const [quizStep,setQuizStep]=useState(0);
  const [quizAnswers,setQuizAnswers]=useState({goals:{},routine:{}});
  const [quizCompleted,setQuizCompleted]=useState({goals:false,routine:false});
  const [badgeCelebration,setBadgeCelebration]=useState(null);
  const [milestoneCelebration,setMilestoneCelebration]=useState(null);
  const {progress,setProgress,resetProgress,hydrated}=usePersistentProgress();

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
  }),[baseMember,derived]);

  const decision=useMemo(()=>getHomeDecision(member),[member]);
  const cashback=Math.floor(derived.points/1000)*5;
  const nextReward=Math.ceil((derived.points+1)/500)*500;
  const rewardProgress=Math.min(100,Math.round((derived.points%500)/500*100));
  const unlocked=derived.badgeState.filter(b=>b.unlocked).length;
  const tier=tierCatalog.find(t=>derived.points>=t.min&&derived.points<=t.max)||tierCatalog[2];

  const go=target=>{setPage(target);setQuizMode(null);setQuizStep(0);window.scrollTo({top:0,behavior:'smooth'});};
  const startQuiz=type=>{setPage('Wellness');setQuizMode(type);setQuizStep(0);window.scrollTo({top:0,behavior:'smooth'});};

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
    const current=progress.lessonCount||baseMember.education.completed_modules;
    const nextCount=Math.max(current,index+1);
    if(nextCount===current) return;
    commitProgress({...progress,lessonCount:nextCount},makeProgressEvent('Learn','Masterclass progress',`${nextCount}/3 lessons complete`));
  };

  const submitReview=()=>{
    if(progress.reviewSubmitted) return;
    commitProgress({...progress,reviewSubmitted:true},makeProgressEvent('Rewards','Community review submitted','Community Voice progress updated'),{analyticsEvent:eventNames.reviewSubmitted});
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

  const Header=()=> <><header className="appHeader"><button className="logo" onClick={()=>go('Today')}>Dose</button><span className="demoPill">John · Member</span><button className="avatar" onClick={()=>go('You')}>J</button></header><div className="profileSwitch"><span>Demo state</span><select value={profileKey} onChange={e=>setProfileKey(e.target.value)}>{Object.entries(labels).map(([key,label])=><option value={key} key={key}>{label}</option>)}</select></div></>;

  let content;
  if(page==='Today') content=<PrioritizedToday member={member} decision={decision} currentStreak={derived.streak} points={derived.points} cashback={cashback} unlocked={unlocked} badgeCount={BADGES.length} rewardProgress={rewardProgress} nextReward={nextReward} lessonCount={derived.lessonCount} taken={derived.takenToday} onTaken={toggleDose} onNavigate={go} onWellness={()=>startQuiz(member.check_in?.due?'routine':'goals')}/>;
  else if(page==='Journey') content=<JourneyHub member={member} derived={derived} progressEvents={progress.events} points={derived.points}/>;
  else if(page==='Learn') content=<LearnScreen lessonCount={derived.lessonCount} onCompleteLesson={completeLesson}/>;
  else if(page==='Orders') content=<OrdersScreen member={member} onNavigate={go}/>;
  else if(page==='Plan') content=<PlanScreen member={member} onNavigate={go}/>;
  else if(page==='Wellness') content=<WellnessScreen quizMode={quizMode} setQuizMode={setQuizMode} quizStep={quizStep} setQuizStep={setQuizStep} quizAnswers={quizAnswers} setQuizAnswers={setQuizAnswers} quizCompleted={quizCompleted} setQuizCompleted={setQuizCompleted} quizzes={quizzes} startQuiz={startQuiz}/>;
  else if(page==='Rewards') content=<RewardsScreen tier={tier} points={derived.points} cashback={cashback} badgeState={derived.badgeState} reviewSubmitted={progress.reviewSubmitted} onSubmitReview={submitReview} onPreviewBadge={setBadgeCelebration} BADGES={BADGES}/>;
  else if(page==='Discover') content=<DiscoverScreen added={added} setAdded={setAdded}/>;
  else content=<MemberPortal name="John" streak={derived.streak} points={derived.points} cashback={cashback} onNavigate={go}/>;

  return <main className={`appShell ${hydrated?'appHydrated':'appHydrating'}`}><Header/>{content}<nav className="bottomNav canonicalNav"><button className={page==='Today'?'active':''} onClick={()=>go('Today')}><span>⌂</span>Today</button><button className={page==='Journey'?'active':''} onClick={()=>go('Journey')}><span>◇</span>Journey</button><button className={page==='Learn'?'active':''} onClick={()=>go('Learn')}><span>□</span>Learn</button><button className={page==='Orders'?'active':''} onClick={()=>go('Orders')}><span>▣</span>Orders</button><button className={['You','Plan','Wellness','Rewards','Discover'].includes(page)?'active':''} onClick={()=>go('You')}><span>○</span>You</button></nav><LeadershipDemoPanel currentDay={derived.journeyDay} onTrigger={triggerDemo} onReset={resetDemo}/><BadgeUnlockTakeover active={Boolean(badgeCelebration)} badge={badgeCelebration} onClose={()=>setBadgeCelebration(null)}/><MilestoneCelebration active={Boolean(milestoneCelebration)} {...milestoneCelebration} onClose={()=>setMilestoneCelebration(null)}/></main>;
}
