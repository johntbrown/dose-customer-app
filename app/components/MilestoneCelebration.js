'use client';

import { useEffect, useMemo } from 'react';

const palette = ['#FBF7EE','#E7E2D7','#CEC6AF','#344633','#6C8269','#A8B59F'];

export default function MilestoneCelebration({ active, variant='major', title, eyebrow='Milestone reached', description, reward, mark='✦', onClose }) {
  const pieces = useMemo(()=>Array.from({length:variant==='legendary'?96:72},(_,i)=>({
    id:i,
    left:`${(i*29)%100}%`,
    delay:`${(i%16)*38}ms`,
    duration:`${1500+(i%9)*110}ms`,
    drift:`${((i*23)%180)-90}px`,
    color:palette[i%palette.length],
    size:6+(i%5)*2,
  })),[variant]);

  useEffect(()=>{
    if(!active) return;
    const key=e=>e.key==='Escape'&&onClose?.();
    const prev=document.body.style.overflow;
    document.body.style.overflow='hidden';
    document.addEventListener('keydown',key);
    return()=>{document.body.style.overflow=prev;document.removeEventListener('keydown',key)};
  },[active,onClose]);

  if(!active) return null;
  return <div className={`milestoneTakeover ${variant}`} role="dialog" aria-modal="true" aria-labelledby="milestoneCelebrationTitle">
    <div className="milestoneBackdrop" aria-hidden="true"/>
    <div className="milestoneOrbit" aria-hidden="true"><i/><i/><i/></div>
    <div className="milestoneConfetti" aria-hidden="true">{pieces.map(p=><i key={p.id} style={{'--left':p.left,'--delay':p.delay,'--duration':p.duration,'--drift':p.drift,'--particle':p.color,'--size':`${p.size}px`}}/>)}</div>
    <button className="milestoneClose" aria-label="Close celebration" onClick={onClose}>×</button>
    <div className="milestoneContent">
      <span className="milestoneEyebrow">{eyebrow}</span>
      <div className="milestoneMark" aria-hidden="true"><span>{mark}</span></div>
      <h1 id="milestoneCelebrationTitle">{title}</h1>
      <p>{description}</p>
      {reward&&<div className="milestoneReward"><span>You unlocked</span><strong>{reward}</strong></div>}
      <button className="milestonePrimary" onClick={onClose}>Continue my journey</button>
    </div>
  </div>;
}
