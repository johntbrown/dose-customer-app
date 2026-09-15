'use client';

export default function SplashScreen({name='Alex',onContinue}){
  return <div className="splashScreen">
    <div className="splashTop"><span className="splashLogo">Dose</span><span className="memberPill">Member</span></div>
    <div className="splashBody">
      <div className="splashArt" aria-hidden="true"><div className="sunDisc"/><div className="bottleSilhouette"/></div>
      <p className="splashEyebrow">Welcome to My Dose</p>
      <h1>Your routine,<br/>all in one place.</h1>
      <p className="splashCopy">Track your orders, know what to expect, learn about your product, and get more from your subscription.</p>
      <div className="splashBenefits">
        <span>Product education</span><span>Results timeline</span><span>Order tracking</span><span>Member benefits</span>
      </div>
    </div>
    <div className="splashFooter">
      <button className="splashPrimary" onClick={onContinue}>Continue as {name}</button>
      <button className="splashSecondary">Use a different account</button>
    </div>
  </div>
}
