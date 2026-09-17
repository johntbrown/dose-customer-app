'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { emitDoseToast } from '../lib/asyncContract';

const InteractionContext = createContext(null);
const DEFAULT_STATE = { status:'idle', error:null, updatedAt:null };

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export default function InteractionProvider({ children }) {
  const [mode,setMode]=useState('normal');
  const [actions,setActions]=useState({});
  const modeRef=useRef(mode);

  useEffect(()=>{ modeRef.current=mode; },[mode]);

  useEffect(()=>{
    const onMode=e=>{
      const next=e.detail?.mode;
      if(['normal','slow','fail-next'].includes(next)) setMode(next);
    };
    window.addEventListener('dose:set-interaction-mode',onMode);
    return()=>window.removeEventListener('dose:set-interaction-mode',onMode);
  },[]);

  const stateFor=useCallback(key=>actions[key]||DEFAULT_STATE,[actions]);

  const runAction=useCallback(async(key,{
    task,
    optimistic,
    rollback,
    onSuccess,
    successTitle='Saved',
    successMessage='',
    errorTitle='That didn’t save',
    errorMessage='Your previous state is still intact. Please try again.',
    pendingTitle,
    silentSuccess=false,
  }={})=>{
    if((actions[key]||DEFAULT_STATE).status==='pending') return { ok:false, duplicate:true };

    if(typeof navigator!=='undefined' && !navigator.onLine){
      const error=new Error('You are offline');
      setActions(prev=>({...prev,[key]:{status:'error',error,updatedAt:Date.now()}}));
      emitDoseToast({tone:'warning',title:'You’re offline',message:'Reconnect before making this change.'});
      return {ok:false,error};
    }

    setActions(prev=>({...prev,[key]:{status:'pending',error:null,updatedAt:Date.now(),pendingTitle}}));
    try{
      await optimistic?.();
      const activeMode=modeRef.current;
      await wait(activeMode==='slow'?2200:520);
      if(activeMode==='fail-next'){
        setMode('normal');
        throw new Error('QA simulated failure');
      }
      const result=task?await task():{confirmed:true,prototype:true};
      await onSuccess?.(result);
      setActions(prev=>({...prev,[key]:{status:'success',error:null,updatedAt:Date.now()}}));
      if(!silentSuccess) emitDoseToast({tone:'success',title:successTitle,message:successMessage});
      window.setTimeout(()=>setActions(prev=>prev[key]?.status==='success'?{...prev,[key]:DEFAULT_STATE}:prev),1200);
      return {ok:true,data:result};
    }catch(error){
      try{ await rollback?.(error); }catch{}
      setActions(prev=>({...prev,[key]:{status:'error',error,updatedAt:Date.now()}}));
      emitDoseToast({tone:'error',title:errorTitle,message:errorMessage});
      return {ok:false,error};
    }
  },[actions]);

  const value=useMemo(()=>({mode,setMode,stateFor,runAction}),[mode,stateFor,runAction]);
  return <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>;
}

export function useInteraction(){
  const value=useContext(InteractionContext);
  if(!value) throw new Error('useInteraction must be used inside InteractionProvider');
  return value;
}
