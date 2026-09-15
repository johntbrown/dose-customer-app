"use client";

import { useMemo, useState } from "react";

const initialWeek = [true, true, true, false, true, true, false];
const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

function consistencyScore(days: boolean[]) {
  return Math.round((days.filter(Boolean).length / days.length) * 100);
}

function confidenceCopy(confidence: string) {
  switch (confidence) {
    case "seeing_progress":
      return "You’re noticing progress. Keep the routine steady and use your next checkpoint to validate what is changing.";
    case "unsure":
      return "Not feeling a clear difference yet is useful information. Stay consistent, check your routine, and use the next checkpoint before changing course.";
    case "disappointed":
      return "Let’s troubleshoot before you give up. We can check consistency, timing, inventory, and whether your current plan still fits.";
    default:
      return "You’re building the habit. Keep going and we’ll help you evaluate progress at the right moment.";
  }
}

export default function HabitProgressEngine() {
  const [week, setWeek] = useState(initialWeek);
  const [todayLogged, setTodayLogged] = useState(false);
  const [confidence, setConfidence] = useState("optimistic");

  const consistency = useMemo(() => consistencyScore(week), [week]);

  function logToday() {
    const next = [...week];
    next[6] = true;
    setWeek(next);
    setTodayLogged(true);
  }

  return (
    <>
      <section className="card habit-engine">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HABIT</p>
            <h3>Your week</h3>
          </div>
          <strong className="consistency-pill">{consistency}% consistent</strong>
        </div>

        <div className="week-grid" aria-label="Weekly Dose consistency">
          {week.map((complete, index) => (
            <div className="day-cell" key={`${dayLabels[index]}-${index}`}>
              <span className="day-label">{dayLabels[index]}</span>
              <span className={complete ? "day-dot complete" : "day-dot"}>{complete ? "✓" : ""}</span>
            </div>
          ))}
        </div>

        <div className="recovery-callout">
          <div>
            <strong>{todayLogged ? "You’re back on track." : "Missed yesterday? Nothing resets."}</strong>
            <p>
              Progress is built by returning to the routine, not by being perfect every day.
            </p>
          </div>
          <button className="secondary" onClick={logToday} disabled={todayLogged}>
            {todayLogged ? "Dose logged" : "Log today’s Dose"}
          </button>
        </div>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="eyebrow">PROGRESS CHECK-IN</p>
          <h3>How are you feeling about your progress?</h3>
          <div className="confidence-options">
            <button
              className={confidence === "seeing_progress" ? "choice selected" : "choice"}
              onClick={() => setConfidence("seeing_progress")}
            >
              Seeing progress
            </button>
            <button
              className={confidence === "optimistic" ? "choice selected" : "choice"}
              onClick={() => setConfidence("optimistic")}
            >
              Still optimistic
            </button>
            <button
              className={confidence === "unsure" ? "choice selected" : "choice"}
              onClick={() => setConfidence("unsure")}
            >
              Not sure yet
            </button>
            <button
              className={confidence === "disappointed" ? "choice selected" : "choice"}
              onClick={() => setConfidence("disappointed")}
            >
              Not seeing enough
            </button>
          </div>
          <p className="adaptive-copy">{confidenceCopy(confidence)}</p>
        </article>

        <article className="card progress-score-card">
          <p className="eyebrow">READINESS</p>
          <h3>Your routine is taking shape</h3>
          <div className="readiness-bar" aria-label="Customer readiness score">
            <span style={{ width: `${Math.min(100, consistency)}%` }} />
          </div>
          <div className="readiness-list">
            <p><span>✓</span> Routine established</p>
            <p><span>✓</span> Product usage understood</p>
            <p><span>{consistency >= 80 ? "✓" : "○"}</span> Consistency on track</p>
            <p><span>○</span> Next progress checkpoint</p>
          </div>
        </article>
      </section>
    </>
  );
}
