'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }){
  useEffect(()=>{
    console.error('[My Dose] application error', error);
  },[error]);

  return <main className="appShell appStatePreviewShell">
    <section className="stateCenterCard" role="alert">
      <div className="stateMark">!</div>
      <span className="eyebrow">Something didn’t load</span>
      <h1>We hit a snag.</h1>
      <p>Your account and subscription have not been changed. Try again, or come back in a moment.</p>
      <div className="stateActions"><button className="primary" onClick={reset}>Try again</button><a href="/">Return to My Dose</a></div>
      <small>If this keeps happening, Dose support can help without losing your progress.</small>
    </section>
  </main>;
}
