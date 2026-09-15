'use client';

const LIVER='https://cdn.shopify.com/s/files/1/0348/3317/0477/files/liver-alt-media-bottle-no-badge.png?v=1770661532&width=900';
const RECIPES=[
 ['Dose for your Liver | Feel Good Summer Recipes','https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80'],
 ['Dose for Cholesterol | Feel Good Summer Recipes','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80'],
 ['Liver + Cholesterol Bundle | Feel Good Summer Recipes','https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80']
];

export default function MemberPortal({name='Alex',streak=6,points=1240,cashback=5,onNavigate}){
  return <div className="portalPage">
    <section className="portalWelcome">
      <div>
        <span className="portalKicker">Member home</span>
        <h1>Welcome, {name}!</h1>
      </div>
      <p>Stay in control of your Dose routine. Manage your subscription, access supportive resources, and connect with experts to get the most out of your Dose journey.</p>
    </section>

    <section className="portalRewardSummary">
      <div><span>Current streak</span><strong>{streak} days</strong></div>
      <div><span>Reward points</span><strong>{points.toLocaleString()} pts</strong></div>
      <div><span>Cash back</span><strong>${cashback} available</strong></div>
      <button onClick={()=>onNavigate?.('Rewards')}>Open rewards</button>
    </section>

    <section className="memberValueStrip">
      <div><strong>More than a subscription.<br/>A support system.</strong></div>
      <div className="valueChips"><span>Clinical nutritionist consultations</span><span>30% off your first subscription order</span><span>15% off every order after</span><span>Exclusive gifts & milestone celebrations</span><span>Monthly recipe eBooks</span><span>Expert liver health guides</span></div>
    </section>

    <section className="portalSection">
      <div className="portalSectionHead"><div><span className="portalKicker">Steps for success</span><h2>Get the most out of your Dose journey.</h2></div></div>
      <div className="successGrid">
        <article className="successCard">
          <span className="stepPill">Step 1</span>
          <h3>Onboarding with a Dose health concierge</h3>
          <p>Our concierge is standing by to help answer questions about starting your Dose journey, from adjusting your dosage to navigating health resources.</p>
          <button className="textLink">What can I expect from my call?</button>
          <div className="supportFacts"><span><b>Flexible scheduling</b><small>Choose a time that works for you</small></span><span><b>15-minute session</b><small>1-on-1 concierge consultation</small></span></div>
          <button className="portalPrimary">Book your call</button>
        </article>
        <article className="successCard">
          <div className="cardTopLine"><span className="stepPill">Step 2</span><span className="freeLabel">Free <s>$120</s></span></div>
          <h3>Clinical nutritionist consultation</h3>
          <p>Schedule a complimentary session with our clinical nutritionist to create a health action plan and review bloodwork. Free and optional.</p>
          <button className="textLink">What can I expect from my call?</button>
          <div className="supportFacts"><span><b>Flexible scheduling</b><small>Choose a time that works for you</small></span><span><b>30-minute session</b><small>1-on-1 expert consultation</small></span></div>
          <button className="portalPrimary">Book your session</button>
        </article>
      </div>
    </section>

    <section className="portalSection">
      <div className="portalSectionHead"><div><span className="portalKicker">Your subscription</span></div><button onClick={()=>onNavigate?.('Plan')}>View all</button></div>
      <article className="subscriptionBar">
        <img src={LIVER} alt="Dose for your Liver"/>
        <div className="subscriptionCopy"><strong>Next delivery: September 28</strong><span>$63.00 every 24 days</span><small>You save $27.00</small></div>
        <button className="portalPrimary" onClick={()=>onNavigate?.('Plan')}>Manage subscription</button>
      </article>
    </section>

    <section className="portalSection">
      <div className="portalSectionHead"><div><span className="portalKicker">Your Dose journey</span><h2>Follow your progress, month by month.</h2></div></div>
      <article className="journeyPanel">
        <div className="journeyTabs"><button>‹</button><span>Phase 1: Months 1–3 <b>You are here</b></span><button>›</button></div>
        <div className="journeyContent">
          <div className="journeyDial"><div className="dialRing"><span>1</span><i/><span>3</span><em>Your 12-Month<br/>Dose Journey</em></div></div>
          <div className="journeyCopy"><span className="portalKicker">What to expect</span><p>The active ingredients are building up in your system, laying the foundation for benefits to compound in the coming months. Curcumin starts supporting the liver's natural response to stress and diet. Milk thistle begins supporting healthy liver cell function.</p><button className="textLink" onClick={()=>onNavigate?.('Journey')}>View full results timeline</button></div>
        </div>
      </article>
    </section>

    <section className="portalSection">
      <div className="portalSectionHead"><div><span className="portalKicker">Monthly recipe eBooks</span><p>Your subscription includes a free recipe eBook each month, with seasonal ingredients selected to support your health goals.</p></div><button>View all</button></div>
      <div className="recipeRail">{RECIPES.map(([title,img])=><button className="recipeCard" key={title}><img src={img} alt=""/><span>{title}</span></button>)}</div>
    </section>

    <section className="portalSection">
      <div className="portalSectionHead"><div><span className="portalKicker">We're here for you</span><p>Email, chat, or call customer support for help with your subscription.</p></div></div>
      <div className="supportGrid"><a href="tel:8884543320"><span>Text or call us</span><strong>(888) 454-3320</strong></a><a href="mailto:weactuallycare@dosedaily.co"><span>Email us</span><strong>weactuallycare@dosedaily.co</strong></a><button><span>Chat with us</span><strong>Start a chat</strong></button></div>
    </section>

    <section className="portalSection portalCommunity">
      <div><span className="portalKicker">Get connected</span><h2>Join the Dose community.</h2><p>Follow real customer stories, exchange tips, ask questions, and participate in exclusive community giveaways.</p><button className="portalSecondary">Join Facebook group</button></div>
      <div className="communityQuote"><small>Dose Member</small><p>“I'm on my second month and feel great. The bloating is gone.”</p></div>
    </section>

    <section className="portalSection perkGrid">
      <article><span>Learn & earn</span><h3>Build your streak, finish lessons, unlock badges, and collect points.</h3><button className="textLink" onClick={()=>onNavigate?.('Rewards')}>Open Dose Rewards</button></article>
      <article><span>Give $40. Get $40.</span><h3>Invite a friend to start their Dose journey.</h3><button className="textLink">Send invites</button></article>
      <article><span>HSA/FSA</span><h3>Save more by paying with eligible HSA/FSA funds.</h3><button className="textLink">Learn more</button></article>
    </section>
  </div>
}
