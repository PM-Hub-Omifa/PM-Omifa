import './globals.css';
export const metadata = { title: 'PM Omifa', description: 'Project Management pentru fit-out' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ro"><body>{children}</body></html>;
}
