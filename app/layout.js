import './globals.css';
import './polish.css';
import './discovery-fix.css';
import './brand-system.css';
import './portal.css';
import './gamification.css';

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
      <body>{children}</body>
    </html>
  );
}
