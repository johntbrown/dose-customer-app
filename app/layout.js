import './globals.css';
import './polish.css';
import './discovery-fix.css';
import './brand-system.css';
import './portal.css';
import './gamification.css';
import './wellness.css';
import './native-polish.css';
import './icon-system.css';
import './features.css';
import './priority-home.css';
import './journey-integrated.css';
import './you-hub.css';
import './celebrations.css';
import './badge-takeover.css';
import './milestone-celebration.css';
import './demo-controls.css';
import './experience-polish.css';
import './design-foundation.css';
import './experience-state.css';
import './boot-polish.css';
import ExperienceShell from './components/ExperienceShell';

export const metadata = {
  title: 'My Dose',
  description: 'Dose member experience V0',
  manifest: '/manifest.webmanifest',
  themeColor: '#FBF7EE',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><ExperienceShell>{children}</ExperienceShell></body>
    </html>
  );
}
