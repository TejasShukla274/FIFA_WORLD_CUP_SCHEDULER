import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import { ThemeProvider } from '../components/ThemeContext';
import { FavoritesProvider } from '../components/FavoritesContext';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Planner & Schedule',
  description: 'View match schedules, manage favorite teams, track fixtures, and follow countdowns in Indian Standard Time (IST) for the FIFA World Cup 2026.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <FavoritesProvider>
            <Navbar />
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <footer className="border-t border-border-card bg-bg-main py-6 text-center text-xs text-text-dark">
              <div className="max-w-7xl mx-auto px-4">
                <p>&copy; {new Date().getFullYear()} FIFA World Cup 2026 Planner. All kickoff times are shown in Indian Standard Time (IST).</p>
                <p className="mt-1.5 text-text-dark/60 text-[10px]">This is an independent planner and is not affiliated with or endorsed by FIFA.</p>
              </div>
            </footer>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
