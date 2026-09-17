'use client';

import { useEffect, useState } from 'react';

export default function LeadershipDemoPanel({ onTrigger, onReset, currentDay=1 }) {
  const [open,setOpen]=useState(false);

  useEffect(()=>{
    const key=e=>{
      if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key.toLowerCase()==='d'){
        e.preventDefault();
        setOpen(v=>!v);
      }
    };
    window.addEventListener('keydown',key);
    return()=>window.removeEventListener('keydown',key);
  },[]);

  return <>
    <button className="demoControlFab" onClick={()=>setOpen(true)} aria-label="Open demo controls">Demo</button>
    {open&&<div className="demoControlBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
      <section className="demoControlPanel" role="dialog" aria-modal="true" aria-labelledby="demoControlsTitle">
        <div className="demoControlHead"><div><span>Leadership preview</span><h2 id="demoControlsTitle">Demo controls</h2><p>Jump to high-value lifecycle moments without changing production logic.</p></div><button onClick={()=>setOpen(false)} aria-label="Close demo controls">×</button></div>
        <div className="demoCurrentState"><span>Current journey day</span><strong>{currentDay}</strong></div>
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
        <div className="demoControlFooter"><button onClick={onReset}>Reset demo progress</button><small>Shortcut: ⌘/Ctrl + Shift + D</small></div>
      </section>
    </div>}
  </>;
}
