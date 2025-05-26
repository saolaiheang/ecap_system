// src/app/layout.tsx
import path from 'path';
console.log('CSS Path:', path.resolve(__dirname, '../styles/global.css'));
import "../styles/globals.css";
import Header from '@/components/header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">

      <body>
        <Header/> {children}</body>
    </html>
  );
}