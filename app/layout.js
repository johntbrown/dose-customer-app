import './globals.css';

export const metadata = {
  title: 'My Dose',
  description: 'Dose member experience V0',
  manifest: '/manifest.webmanifest',
  themeColor: '#f5f2e9'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}