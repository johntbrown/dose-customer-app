import { getPlanExperience } from "../../lib/planOrchestrator";

export default async function MyPlanPage() {
  const plan = await getPlanExperience({ doseCustomerId: "cust_demo_001" });

  return (
    <main className="shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">MY PLAN</p>
          <h1>Manage your Dose plan</h1>
          <p className="subtle">Review timing, inventory fit, and plan settings in one place.</p>
        </div>
        <div className="avatar">JB</div>
      </section>

      <section className="card">
        <p className="eyebrow">CURRENT PLAN</p>
        <h2>{plan.productName}</h2>
        <p className="subtle">{plan.status} · {plan.quantity} bottles · every {plan.cadenceDays} days</p>
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">NEXT ORDER</p>
            <h3>{plan.nextOrderDate}</h3>
          </div>
          <button className="secondary">Review timing</button>
        </div>
        <div className="plan-row">
          <div>
            <span className="label">Ships</span>
            <strong>{plan.nextShipmentDate}</strong>
          </div>
          <div>
            <span className="label">Quantity</span>
            <strong>{plan.quantity} bottles</strong>
          </div>
          <div>
            <span className="label">Cadence</span>
            <strong>Every {plan.cadenceDays} days</strong>
          </div>
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">INVENTORY FIT</p>
        <h3>Does this timing match how quickly you are using Dose?</h3>
        <p className="subtle">The next pass will turn these responses into personalized plan recommendations.</p>
        <div className="choice-grid">
          <div className="choice selected-choice">I’m on track</div>
          <div className="choice">I have extra Dose left</div>
          <div className="choice">I’m running low</div>
        </div>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="eyebrow">PLAN HELP</p>
          <h3>Start with what no longer fits</h3>
          <p>Route customers to timing, inventory, product-fit, progress, or support options based on the problem they select.</p>
          <button className="secondary">Review plan options</button>
        </article>

        <article className="card">
          <p className="eyebrow">STACK CONTRACT</p>
          <h3>One experience, existing systems underneath</h3>
          <p>Shopify supplies customer context. Skio remains the plan source of truth. RudderStack carries app events, and durable lifecycle state remains upstream in Customer 360 and BigQuery.</p>
        </article>
      </section>

      <nav className="bottom-nav" aria-label="Primary navigation">
        <a href="/">Home</a>
        <a href="#">Progress</a>
        <a className="selected" href="/my-plan">My Plan</a>
        <a href="#">Rewards</a>
        <a href="#">Learn</a>
      </nav>
    </main>
  );
}
