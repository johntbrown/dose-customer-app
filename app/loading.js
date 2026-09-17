export default function Loading(){
  return <main className="appShell appStatePreviewShell" aria-busy="true" aria-label="Loading My Dose">
    <header className="appHeader stateHeaderSkeleton"><div className="skeleton skeletonLogo"/><div className="skeleton skeletonPill"/><div className="skeleton skeletonAvatar"/></header>
    <div className="stateLoadingPage">
      <section className="stateLoadingHero"><div className="skeleton skeletonEyebrow"/><div className="skeleton skeletonHeadline"/><div className="skeleton skeletonHeadline short"/><div className="skeleton skeletonBody"/></section>
      <section className="stateLoadingPrimary"><div className="skeleton skeletonCircle"/><div className="stateLoadingCopy"><div className="skeleton skeletonEyebrow"/><div className="skeleton skeletonCardTitle"/><div className="skeleton skeletonBody wide"/></div><div className="skeleton skeletonButton"/></section>
      <div className="stateLoadingGrid">{[0,1,2].map(i=><article key={i}><div className="skeleton skeletonEyebrow"/><div className="skeleton skeletonCardTitle"/><div className="skeleton skeletonBody"/><div className="skeleton skeletonBody short"/></article>)}</div>
    </div>
  </main>;
}
