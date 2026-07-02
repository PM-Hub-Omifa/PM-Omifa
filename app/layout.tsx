import './globals.css';
export const metadata = { title: 'PM Omifa v2 Preview', description: 'Construction Intelligence Platform' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ro"><body>{children}</body></html>;
}
