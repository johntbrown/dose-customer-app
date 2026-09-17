export default function NotFound(){
  return <main className="appShell appStatePreviewShell">
    <section className="stateCenterCard">
      <div className="stateMark">404</div>
      <span className="eyebrow">Page not found</span>
      <h1>This isn’t part of your Dose journey.</h1>
      <p>The link may be old, or this experience may have moved.</p>
      <div className="stateActions"><a className="primary" href="/">Back to My Dose</a></div>
    </section>
  </main>;
}
