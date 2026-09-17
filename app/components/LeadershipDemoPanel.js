'use client';

import { useEffect, useState } from 'react';
import { useInteraction } from './InteractionProvider';

export default function LeadershipDemoPanel({ onTrigger, onReset, currentDay=1 }) {
  const [open,setOpen]=useState(false);
  const {mode,setMode}=useInteraction();

  useEffect(()=>{
    const key=e=>{
      if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key.toLowerCase()==='d'){
        e.preventDefault();
        setOpen(v=>!v);
      }
      if(e.key==='Escape') setOpen(false);
    };
    window.addEventListener('keydown',key);
    return()=>window.removeEventListener('keydown',key);
  },[]);

  return <>
    <button className="demoControlFab" onClick={()=>setOpen(true)} aria-label="Open demo controls">Demo</button>
    {open&&<div className="demoControlBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
      <section className="demoControlPanel" role="dialog" aria-modal="true" aria-labelledby="demoControlsTitle">
        <div className="demoControlHead"><div><span>Leadership preview</span><h2 id="demoControlsTitle">Demo controls</h2><p>Jump to lifecycle moments and intentionally QA imperfect network states.</p></div><button onClick={()=>setOpen(false)} aria-label="Close demo controls">×</button></div>
        <div className="demoCurrentState"><span>Current journey day</span><strong>{currentDay}</strong></div>
        <div className="interactionModeBlock">
          <div><div><strong>Interaction QA</strong><small>Applies to the next real member action</small></div><span className={`interactionModeBadge ${mode}`}>{mode==='normal'?'Normal':mode==='slow'?'Slow network':'Fail next'}</span></div>
          <div className="interactionModeButtons">
            <button className={mode==='normal'?'active':''} onClick={()=>setMode('normal')}>Normal</button>
            <button className={mode==='slow'?'active':''} onClick={()=>setMode('slow')}>Slow</button>
            <button className={mode==='fail-next'?'active':''} onClick={()=>setMode('fail-next')}>Fail next</button>
          </div>
        </div>
        <div className="demoControlGrid">
          <button onClick={()=>onTrigger?.('day7')}><b>Day 7</b><span>Starter badge</span></button>
          <button onClick={()=>onTrigger?.('day24')}><b>Day 24</b><span>First cycle</span></button>
          <button onClick={()=>onTrigger?.('day72')}><b>Day 72</b><span>Travel case</span></button>
          <button onClick={()=>onTrigger?.('day90')}><b>Day 90</b><span>Legendary milestone</span></button>
          <button onClick={()=>onTrigger?.('risk')}><b>At risk</b><span>Support priority</span></button>
          <button onClick={()=>onTrigger?.('payment')}><b>Payment failed</b><span>P0 recovery</span></button>
          <button onClick={()=>onTrigger?.('review')}><b>Review</b><span>Community Voice</span></button>
          <button onClick={()=>onTrigger?.('challenge')}><b>Challenge</b><span>Major completion</span></button>
        </div>
        <a className="statePreviewLink" href="/states"><span><strong>Production-state QA</strong><small>Loading · empty · stale · error · saving · success</small></span><b>›</b></a>
        <div className="demoControlFooter"><button onClick={()=>{setMode('normal');onReset?.();}}>Reset demo progress</button><small>Shortcut: ⌘/Ctrl + Shift + D</small></div>
      </section>
    </div>}
  </>;
}
