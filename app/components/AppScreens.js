'use client';

import { useState } from 'react';
import CelebrationBurst from './CelebrationBurst';
import { useInteraction } from './InteractionProvider';

const LIVER='https://cdn.shopify.com/s/files/1/0348/3317/0477/files/liver-alt-media-bottle-no-badge.png?v=1770661532&width=900';
const LIVER_LIFE='https://dosedaily.co/cdn/shop/files/liver-home-product-section-up_900x.jpg?v=1613554269';
const CHOL='https://dosedaily.co/cdn/shop/files/cholesterol-alt-media-bottle.png?v=1770054243&width=900';

function ActionButton({actionKey,children,onRun,className='',disabled=false,pendingLabel='Saving…'}){
  const {stateFor}=useInteraction();
  const state=stateFor(actionKey);
  const pending=state.status==='pending';
  return <button className={`${className} ${pending?'isSaving':''}`} disabled={disabled||pending} aria-busy={pending} onClick={onRun}>{pending?<><span className="inlineActionSpinner"/> {pendingLabel}</>:children}</button>;
}

export function LearnScreen({lessonCount,onCompleteLesson}){
  const {runAction,stateFor}=useInteraction();
  const titles=['Meet your daily Dose','What to expect in Month 1','How to measure progress'];
  const complete=async i=>{
    if(i<lessonCount) return;
    await runAction(`lesson.${i}`,{
      onSuccess:()=>onCompleteLesson(i),
      successTitle:'Lesson complete',
      successMessage:'+25 points have been added to your prototype progress.',
      errorTitle:'Lesson progress wasn’t saved',
      errorMessage:'Nothing changed. Try again when you’re ready.',
    });
  };
  return <div className="page"><section className="simpleHero"><span className="eyebrow">Learn</span><h1>Know your Dose.</h1><p>Product education, expectations, and clinical context in one place.</p></section><section className="learnFeatured"><img src={LIVER_LIFE} alt="Dose for your Liver"/><div><span className="eyebrow">Start here</span><h2>Dose for your Liver</h2><p>Learn how to take it, what’s inside, and how to think about progress over time.</p></div></section><div className="sectionHead"><div><span className="eyebrow">Liver Masterclass</span><h2>Learn in 3 quick steps.</h2></div><span className="lessonReward">+25 pts each</span></div><section className="lessonRail">{titles.map((title,i)=>{const done=i<lessonCount;const pending=stateFor(`lesson.${i}`).status==='pending';return <button className={`${done?'lessonTile lessonDone':'lessonTile'} ${pending?'isSaving':''}`} disabled={pending} aria-busy={pending} key={title} onClick={()=>complete(i)}><div className="lessonCover"><span>{pending?<i className="inlineActionSpinner light"/>:`0${i+1}`}</span><small>{pending?'Saving':done?'Complete':'Liver health'}</small></div><div><small>Day {i+1} · {i===1?'4':'3'} min</small><strong>{title}</strong><span>{pending?'Saving progress…':done?'Complete':'+25 pts · Complete lesson →'}</span></div></button>;})}</section></div>;
}

export function OrdersScreen({member,onNavigate}){
  return <div className="page"><section className="simpleHero"><span className="eyebrow">Orders</span><h1>Know exactly<br/>where it is.</h1><p>Track the order that keeps your routine going.</p></section><section className="trackingCard"><div className="trackingTop"><span className={member.order.shipment_exception?'status':'status live'}>{member.order.shipment_exception?'Needs attention':'In transit'}</span><span>#DOSE-28491</span></div><img src={LIVER} alt="Dose order"/><h2>{member.order.shipment_exception?'Review your shipment':`Arriving ${member.order.eta_label}`}</h2><p>{member.product.primary_product} · 1 bottle</p><div className="trackSteps"><div className="complete"><i>✓</i><span><strong>Order confirmed</strong><small>September 28</small></span></div><div className="complete"><i>✓</i><span><strong>Shipped</strong><small>September 29</small></span></div><div className="active"><i>•</i><span><strong>{member.order.shipment_exception?'Exception':'In transit'}</strong><small>{member.order.shipment_exception?'Tap support if you need help':'On the way to you'}</small></span></div></div><button className="primary spaciousPrimary" onClick={()=>onNavigate('Plan')}>Manage next order</button></section></div>;
}

export function PlanScreen({member,onNavigate}){
  const {runAction}=useInteraction();
  const runPlanAction=(key,label)=>runAction(`plan.${key}`,{
    successTitle:`${label} flow ready`,
    successMessage:'Prototype only. Production will wait for Skio or the payment provider to confirm before changing member state.',
    errorTitle:`${label} didn’t go through`,
    errorMessage:'No subscription state changed. Try again or contact support.',
  });
  return <div className="page"><section className="simpleHero"><span className="eyebrow">My plan</span><h1>Your routine,<br/>on your terms.</h1><p>Manage the subscription behind your daily habit.</p></section>{member.subscription.payment_status==='failed'&&<section className="wellnessPrompt supportPriority"><div><span className="eyebrow">Payment failed</span><h2>Update payment to protect your next order.</h2><p>Your subscription stays in the failed state until the source of truth confirms recovery.</p></div><ActionButton actionKey="plan.payment" onRun={()=>runPlanAction('payment','Payment recovery')} pendingLabel="Opening recovery…">Update payment</ActionButton></section>}<section className="planProduct"><div className="productImage"><img src={LIVER} alt="Dose for your Liver"/></div><div><span className="status">{member.subscription.status}</span><h2>{member.product.primary_product}</h2><p>{member.subscription.quantity} bottle every {member.subscription.cadence_days} days</p></div></section><section className="nextOrder"><span className="eyebrow">Next order</span><div><strong>{member.subscription.next_ship_at}</strong><span>Estimated delivery {member.order.eta_label}</span></div><button onClick={()=>onNavigate('Orders')}>Track order</button></section><section className="planActionGrid" aria-label="Subscription actions"><article><div><span className="eyebrow">Timing</span><h3>Need a little more time?</h3><p>Delay the next order without changing your long-term routine.</p></div><ActionButton actionKey="plan.delay" onRun={()=>runPlanAction('delay','Delay')} pendingLabel="Checking…">Delay 7 days</ActionButton></article><article><div><span className="eyebrow">Quantity</span><h3>Adjust what’s coming.</h3><p>Right-size quantity before the next order processes.</p></div><ActionButton actionKey="plan.quantity" onRun={()=>runPlanAction('quantity','Quantity update')} pendingLabel="Checking…">Change quantity</ActionButton></article></section><p className="interactionFinePrint">Prototype interactions demonstrate pending, confirmed, and failure UX. They do not make live subscription changes.</p></div>;
}

export function WellnessScreen({quizMode,setQuizMode,quizStep,setQuizStep,quizAnswers,setQuizAnswers,quizCompleted,setQuizCompleted,quizzes,startQuiz}){
  const {runAction,stateFor}=useInteraction();
  if(quizMode){
    const q=quizzes[quizMode];const item=q.questions[quizStep];const actionKey=`quiz.${quizMode}`;const saving=stateFor(actionKey).status==='pending';
    const choose=async option=>{
      const next={...quizAnswers,[quizMode]:{...quizAnswers[quizMode],[item.id]:option}};
      setQuizAnswers(next);
      if(quizStep<q.questions.length-1){setQuizStep(quizStep+1);return;}
      await runAction(actionKey,{
        onSuccess:()=>{setQuizCompleted({...quizCompleted,[quizMode]:true});setQuizMode(null);setQuizStep(0);},
        successTitle:'Check-in saved',
        successMessage:'Your prototype personalization is up to date.',
        errorTitle:'Check-in wasn’t saved',
        errorMessage:'Your answers are still on screen so you can try again.',
      });
    };
    return <div className="page wellnessPage"><button className="quizBack" disabled={saving} onClick={()=>{setQuizMode(null);setQuizStep(0);}}>← Back to wellness profile</button><section className={`quizRunner ${saving?'isSaving':''}`}><div className="quizProgress"><i style={{width:`${((quizStep+1)/q.questions.length)*100}%`}}/></div><span className="eyebrow">{q.title} · {quizStep+1} of {q.questions.length}</span><h1>{saving?'Saving your check-in…':item.text}</h1><div className="quizOptions">{item.options.map(option=><button disabled={saving} key={option} onClick={()=>choose(option)}>{saving?<span className="inlineActionSpinner"/>:option}<b>{saving?'':'→'}</b></button>)}</div>{saving&&<p className="savingMicrocopy">Keeping this screen stable until the save is confirmed.</p>}</section></div>;
  }
  return <div className="page wellnessPage"><section className="simpleHero"><span className="eyebrow">Your wellness profile</span><h1>Make My Dose<br/>feel more like yours.</h1><p>Short, optional questions help prioritize support, education, and progress experiences.</p></section><section className="quizCards"><article><span className="quizNumber">01</span><h3>Wellness goals</h3><p>Tell us what you care about and what kind of support works best.</p><button onClick={()=>startQuiz('goals')}>{quizCompleted.goals?'Retake quiz':'Start quiz'}</button></article><article><span className="quizNumber">02</span><h3>Routine check-in</h3><p>Tell us how your routine is going and whether you need help.</p><button onClick={()=>startQuiz('routine')}>{quizCompleted.routine?'Retake check-in':'Start check-in'}</button></article></section></div>;
}

export function RewardsScreen({tier,points,cashback,badgeState,reviewSubmitted,onSubmitReview,onPreviewBadge,BADGES}){
  const {runAction,stateFor}=useInteraction();
  const reviewState=stateFor('review.submit');
  const submit=()=>runAction('review.submit',{
    onSuccess:onSubmitReview,
    successTitle:'Review submitted',
    successMessage:'Your Community Voice progress is confirmed in the prototype.',
    errorTitle:'Review wasn’t submitted',
    errorMessage:'Your reward state did not change. Please try again.',
    silentSuccess:true,
  });
  return <div className="page rewardsPage"><section className="simpleHero rewardsHero"><span className="eyebrow">Dose Rewards</span><h1>Your routine<br/>pays you back.</h1><p>Badges, challenge milestones, and gifts react to the same progress state as Today and Journey.</p></section><section className="levelCard"><div className={`levelMedal ${tier.name.toLowerCase()}`}>{tier.name[0]}</div><div className="levelCopy"><span className="eyebrow">Member level</span><h2>{tier.name}</h2><p>{points.toLocaleString()} points · ${cashback} available</p></div></section><section className="badgeGrid">{badgeState.map(b=><article className={b.unlocked?'badgeCard unlocked':'badgeCard'} key={b.id}><div className="badgeMedal"><span>{b.unlocked?'✓':b.mark}</span></div><div className="badgeCopy"><span>{b.unlocked?'Unlocked':'In progress'}</span><h3>{b.name}</h3><div className="badgeBar"><i style={{width:`${b.progress}%`}}/></div><small>{Math.min(b.value,b.threshold)}/{b.threshold}</small></div></article>)}</section><section className="celebrationPreviewCard"><div><span className="eyebrow">Leadership preview</span><h3>Preview the badge unlock moment.</h3><p>Show the full-screen celebration without changing earned state.</p></div><button onClick={()=>onPreviewBadge(BADGES.find(b=>b.id==='starter'))}>Preview unlock</button></section><section className={`reviewCelebrationCard celebrationStage ${reviewSubmitted?'reviewComplete':''}`}><span className="eyebrow">Community Voice</span><h3>{reviewSubmitted?'Thanks for sharing your experience.':'Share your Dose experience.'}</h3><p>{reviewSubmitted?'Your review is recorded in this prototype, and Community Voice is unlocked.':'Reviews help other members know what to expect. Reward the act of sharing, never the sentiment.'}</p><span className="reviewRewardPill">+100 prototype points</span><div style={{marginTop:16}}><ActionButton actionKey="review.submit" onRun={submit} disabled={reviewSubmitted} pendingLabel="Submitting…">{reviewSubmitted?'Review submitted':'Write a review'}</ActionButton></div><CelebrationBurst active={reviewSubmitted} label="Community Voice unlocked" />{reviewState.status==='error'&&<small className="inlineErrorHint">Nothing changed. Your review can be retried safely.</small>}</section></div>;
}

export function DiscoverScreen({added,setAdded}){
  const {runAction}=useInteraction();
  const toggle=()=>runAction('recommendation.add',{
    onSuccess:()=>setAdded(!added),
    successTitle:added?'Removed from next order':'Added to next order',
    successMessage:'Prototype state updated after confirmation.',
    errorTitle:'Order wasn’t changed',
    errorMessage:'Your current order is unchanged. Try again.',
  });
  return <div className="page"><section className="simpleHero"><span className="eyebrow">Recommended for you</span><h1>Relevant, not intrusive.</h1><p>This recommendation is only shown when higher-priority support, payment, and order needs are clear.</p></section><article className="productDiscovery"><div className="productVisual"><span className="recommend">Recommended</span><img src={CHOL} alt="Dose for Cholesterol"/></div><div className="productInfo"><span className="eyebrow">Pairs with your liver routine</span><h2>Dose for Cholesterol</h2><p>Targeted support for healthy cholesterol levels and lipid processing.*</p><div className="productBottom"><div><small>Subscriber add-on</small><strong>From $63 / 24 days</strong></div><ActionButton actionKey="recommendation.add" onRun={toggle} pendingLabel="Updating…">{added?'Added':'Add to next order'}</ActionButton></div></div></article></div>;
}
