'use client';

import { useInteraction } from './InteractionProvider';

const LIVER='https://cdn.shopify.com/s/files/1/0348/3317/0477/files/liver-alt-media-bottle-no-badge.png?v=1770661532&width=900';
const LIVER_LIFE='https://dosedaily.co/cdn/shop/files/liver-home-product-section-up_900x.jpg?v=1613554269';

const primaryCopy={
  fix_payment:{eyebrow:'Action needed',title:'Your payment needs attention.',body:'Update your payment method so your next Dose order can stay on schedule.'},
  review_shipment_issue:{eyebrow:'Shipment update',title:'There’s an issue with your shipment.',body:'Review the latest order status and get help if you need it.'},
  get_support:{eyebrow:'We’re here for you',title:'Let’s get your routine back on track.',body:'Your recent check-in suggests a little extra support could be useful right now.'},
  log_routine:{eyebrow:'Today',title:'Take your daily Dose',body:'Keep your routine moving with one simple check-in.'},
  complete_checkin:{eyebrow:'Quick check-in',title:'Tell us how your routine is going.',body:'A short check-in helps My Dose prioritize the right support and education for you.'},
  track_order:{eyebrow:'Your order',title:'Your Dose is on the way.',body:'See the latest shipment status and expected delivery window.'},
  review_next_order:{eyebrow:'Next order',title:'Review your next delivery.',body:'Make sure your timing and quantity still fit your routine.'},
  review_milestone:{eyebrow:'Your journey',title:'See what this stage means.',body:'Review where you are in the journey and what to expect next.'},
  continue_learning:{eyebrow:'Keep going',title:'Continue your Masterclass.',body:'A few minutes of education can make the routine feel much clearer.'},
  book_service:{eyebrow:'Member support',title:'Use the support included with your membership.',body:'Explore concierge or nutritionist support when it would be useful.'},
  claim_reward:{eyebrow:'Milestone',title:'You have something waiting.',body:'See the reward or challenge milestone you’ve unlocked.'},
  view_recommendation:{eyebrow:'For you',title:'Explore a relevant next product.',body:'See the recommendation selected from your current product ownership and journey.'},
  none:{eyebrow:'Your journey',title:'See how far you’ve come.',body:'Review your milestones, history, and what comes next.'},
};

export default function PrioritizedToday({member,decision,currentStreak,points,cashback,unlocked,badgeCount,rewardProgress,nextReward,lessonCount,taken,onTaken,onNavigate,onWellness}){
  const {runAction,stateFor}=useInteraction();
  const copy=primaryCopy[decision.primary_action_id]||primaryCopy.none;
  const modules=decision.supporting_module_ids||[];
  const routineState=stateFor('routine.log');
  const routinePending=routineState.status==='pending';

  const runPrimary=async()=>{
    if(decision.primary_action_id==='log_routine'){
      await runAction('routine.log',{
        optimistic:onTaken,
        rollback:onTaken,
        successTitle:taken?'Routine updated':'Dose logged',
        successMessage:taken?'Your previous routine state has been restored.':`${currentStreak+1} day streak. Your progress is synced across My Dose.`,
        errorTitle:'Dose wasn’t logged',
        errorMessage:'We restored your previous state so your streak and rewards stay accurate.',
      });
      return;
    }
    if(decision.primary_action_target==='Wellness'){onWellness?.();return;}
    onNavigate?.(decision.primary_action_target||'Journey');
  };
  const monthCopy=['','Build the habit','Keep building confidence','Review progress and fit','Keep the routine working for you'][Math.min(member.lifecycle.month,4)]||'Keep the routine working for you';

  return <div className="page">
    <section className="welcome compact"><div><span className="eyebrow">Day {member.lifecycle.day} · Your liver journey</span><h1>Good afternoon,<br/>{member.identity.first_name}.</h1><p>Here’s the most useful thing to focus on today.</p></div><img src={LIVER} alt="Dose for your Liver"/></section>

    <section className={`todayAction prioritizedPrimary priority-${decision.primary_action_priority} ${routinePending?'isSaving':''}`} aria-busy={routinePending}>
      <div className="checkIcon">{routinePending?<span className="inlineActionSpinner light"/>:decision.primary_action_id==='log_routine'?(taken?'✓':'○'):'→'}</div>
      <div><span className="eyebrow light">{copy.eyebrow}</span><h2>{routinePending?'Saving your routine…':decision.primary_action_id==='log_routine'&&taken?'Daily Dose complete':copy.title}</h2><p>{routinePending?'Keeping your progress consistent across Today, Journey, and Rewards.':decision.primary_action_id==='log_routine'&&taken?`${currentStreak} day streak. Nice work.`:copy.body}</p></div>
      <button disabled={routinePending} onClick={runPrimary}>{routinePending?'Saving…':decision.primary_action_id==='log_routine'&&taken?'Done':decision.primary_action_cta}</button>
    </section>

    {routineState.status==='error'&&<div className="inlineRecoveryMessage" role="status"><strong>Nothing was lost.</strong><span>Your previous routine state was restored. Try again when your connection is stable.</span></div>}

    <div className="homePriorityMeta"><span>Personalized for today</span><small>{decision.rule_version} · {decision.primary_action_reason.replaceAll('_',' ')}</small></div>

    {modules.includes('routine')&&<section className="streakStrip"><div><span className="streakFlame">✦</span><div><strong>{currentStreak} day streak</strong><small>{Math.max(0,7-currentStreak)} days to your next badge</small></div></div><div className="miniBadgeProgress"><span><i style={{width:`${Math.min(100,currentStreak/7*100)}%`}}/></span><b>{Math.min(currentStreak,7)}/7</b></div></section>}

    {modules.includes('checkin')&&<section className="wellnessPrompt"><div><span className="eyebrow">Check-in due</span><h2>Your {String(member.check_in.type||'routine').toUpperCase()} check-in is ready.</h2><p>Tell us how things are going so we can adjust what My Dose prioritizes next.</p></div><button onClick={onWellness}>Start check-in</button></section>}

    {modules.includes('support')&&<section className="wellnessPrompt supportPriority"><div><span className="eyebrow">Support first</span><h2>Get help before anything else.</h2><p>We’re suppressing rewards and product recommendations while this support need is unresolved.</p></div><button onClick={()=>onNavigate?.('You')}>Get help</button></section>}

    {modules.includes('journey')&&<section className="expectationCard" onClick={()=>onNavigate?.('Journey')}><span className="eyebrow">Your journey</span><h2>Month {member.lifecycle.month}: {monthCopy}</h2><p>See your progress, milestones, and what to expect next.</p><strong>Open Journey →</strong></section>}

    {modules.includes('order')&&<><div className="sectionHead"><div><span className="eyebrow">Your order</span><h2>{member.order.shipment_exception?'Needs attention':'On the way.'}</h2></div><button onClick={()=>onNavigate?.('Orders')}>Track</button></div><button className="orderStatus" onClick={()=>onNavigate?.('Orders')}><div className="orderIcon">▣</div><div><span>{member.order.shipment_exception?'Review shipment issue':`Arriving ${member.order.eta_label}`}</span><strong>{member.product.primary_product}</strong><small>{member.order.status.replaceAll('_',' ')}</small></div><b>›</b></button></>}

    {modules.includes('education')&&<><div className="sectionHead"><div><span className="eyebrow">Keep going</span><h2>Continue learning.</h2></div><button onClick={()=>onNavigate?.('Learn')}>See all</button></div><button className="learningHero slim" onClick={()=>onNavigate?.('Learn')}><div className="learningImage"><img src={LIVER_LIFE} alt="Dose education"/><span>Your program</span></div><div className="learningCopy"><span className="eyebrow">Liver Masterclass</span><h3>What to expect in Month 1</h3><p>Build the habit, understand your product, and know when results become meaningful.</p><strong>{lessonCount}/3 complete · Continue →</strong></div></button></>}

    {modules.includes('reward')&&<section className="rewardSnapshot"><div className="rewardSnapshotTop"><div><span className="eyebrow">Dose Rewards</span><h2>{points.toLocaleString()} points</h2><p>${cashback} cash back available · {unlocked}/{badgeCount} badges unlocked</p></div><button onClick={()=>onNavigate?.('Rewards')}>View rewards</button></div><div className="rewardMeter"><div><i style={{width:`${rewardProgress}%`}}/></div><span>{Math.max(0,nextReward-points)} points to your next reward milestone</span></div></section>}

    {modules.includes('service')&&<section className="dailyTip"><span className="tipLabel">Member support</span><h2>Expert help is included.</h2><p>Concierge and nutritionist support are available when you want a little more guidance.</p><button className="inlinePriorityCta" onClick={()=>onNavigate?.('You')}>Explore support</button></section>}

    {modules.includes('recommendation')&&<section className="dailyTip"><span className="tipLabel">Recommended for you</span><h2>There’s another Dose product that may fit your goals.</h2><p>Recommendations only appear when there is no unresolved payment, order, subscription, or support issue.</p><button className="inlinePriorityCta" onClick={()=>onNavigate?.('Discover')}>Explore recommendation</button></section>}
  </div>;
}
