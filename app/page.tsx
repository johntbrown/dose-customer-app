import { getNextBestAction, mockCustomer } from "../lib/mockCustomer";

const customer = mockCustomer;
const nextBestAction = getNextBestAction(customer);

export default function HomePage() {
  return (
    <main className="shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">MY DOSE</p>
          <h1>Good morning, {customer.firstName}</h1>
          <p className="subtle">Day {customer.lifecycleDay} with {customer.product}</p>
        </div>
        <div className="avatar">JB</div>
      </section>

      <section className="hero card">
        <div>
          <p className="eyebrow">TODAY</p>
          <h2>Take your Dose</h2>
          <p>
            Keep the routine simple. You are {customer.weeklyConsistency}% consistent this week.
          </p>
        </div>
        <button className="primary">Log today&apos;s Dose</button>
      </section>

      <section className="grid two">
        <article className="card metric-card">
          <p className="eyebrow">CONSISTENCY</p>
          <div className="big-number">{customer.currentStreak}</div>
          <p>day streak</p>
          <p className="support-copy">
            Miss a day? No problem. Pick it back up today instead of waiting for a perfect restart.
          </p>
        </article>

        <article className="card">
          <p className="eyebrow">NEXT BEST ACTION</p>
          <h3>{nextBestAction.title}</h3>
          <p>{nextBestAction.body}</p>
          <button className="secondary">Review my plan</button>
        </article>
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MY PLAN</p>
            <h3>Your next shipment</h3>
          </div>
          <button className="text-button">Manage</button>
        </div>
        <div className="plan-row">
          <div>
            <span className="label">Next charge</span>
            <strong>{customer.nextChargeDate}</strong>
          </div>
          <div>
            <span className="label">Ships</span>
            <strong>{customer.nextShipmentDate}</strong>
          </div>
          <div>
            <span className="label">Product</span>
            <strong>{customer.product}</strong>
          </div>
        </div>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="eyebrow">PROGRESS</p>
          <h3>Your next checkpoint is coming up</h3>
          <p>
            We&apos;ll help you evaluate your routine, inventory, and confidence before the next major
            decision point.
          </p>
          <div className="timeline">
            {[1, 14, 30, 45, 60, 90].map((day) => (
              <div key={day} className={customer.lifecycleDay >= day ? "milestone active" : "milestone"}>
                <span>{day}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card reward">
          <p className="eyebrow">MEMBER BENEFITS</p>
          <h3>{customer.rewardStatus}</h3>
          <p>Stay on track and we&apos;ll surface your next benefit when it becomes available.</p>
          <button className="secondary">View rewards</button>
        </article>
      </section>

      <nav className="bottom-nav" aria-label="Primary navigation">
        <a className="selected" href="#">Home</a>
        <a href="#">Progress</a>
        <a href="#">My Plan</a>
        <a href="#">Rewards</a>
        <a href="#">Learn</a>
      </nav>
    </main>
  );
}
