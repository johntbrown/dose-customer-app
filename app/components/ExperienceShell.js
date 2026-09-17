'use client';

import { useEffect, useRef, useState } from 'react';

export default function ExperienceShell({ children }) {
  const [offline,setOffline]=useState(false);
  const [toast,setToast]=useState(null);
  const [restored,setRestored]=useState(false);
  const [booting,setBooting]=useState(true);
  const timerRef=useRef(null);

  useEffect(()=>{
    const id=window.setTimeout(()=>setBooting(false),260);
    return()=>window.clearTimeout(id);
  },[]);

  useEffect(()=>{
    const update=()=>{
      const isOffline=!navigator.onLine;
      setOffline(previous=>{
        if(previous && !isOffline){
          setRestored(true);
          window.setTimeout(()=>setRestored(false),2600);
        }
        return isOffline;
      });
    };
    update();
    window.addEventListener('online',update);
    window.addEventListener('offline',update);
    return()=>{
      window.removeEventListener('online',update);
      window.removeEventListener('offline',update);
    };
  },[]);

  useEffect(()=>{
    const onToast=e=>{
      const next=e.detail||{};
      setToast(next);
      if(timerRef.current) clearTimeout(timerRef.current);
      timerRef.current=setTimeout(()=>setToast(null),next.duration||3200);
    };
    window.addEventListener('dose:toast',onToast);
    return()=>{
      window.removeEventListener('dose:toast',onToast);
      if(timerRef.current) clearTimeout(timerRef.current);
    };
  },[]);

  return <>
    {booting&&<div className="doseBootVeil" aria-hidden="true"><div><strong>Dose</strong><i/></div></div>}
    {(offline||restored)&&<div className={`connectionBanner ${offline?'offline':'restored'}`} role="status" aria-live="polite">
      <span className="connectionDot"/>
      <div><strong>{offline?'You’re offline':'Back online'}</strong><small>{offline?'Your saved progress stays on this device. Changes that need the server will wait until you reconnect.':'Your connection has been restored.'}</small></div>
    </div>}
    {children}
    {toast&&<div className={`doseToast ${toast.tone||'success'}`} role="status" aria-live="polite">
      <span className="doseToastIcon">{toast.tone==='error'?'!':toast.tone==='warning'?'•':'✓'}</span>
      <div><strong>{toast.title||'Saved'}</strong>{toast.message&&<small>{toast.message}</small>}</div>
      <button aria-label="Dismiss notification" onClick={()=>setToast(null)}>×</button>
    </div>}
  </>;
}
