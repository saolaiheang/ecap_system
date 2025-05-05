// src/app/layout.tsx
import path from 'path';
console.log('CSS Path:', path.resolve(__dirname, '../styles/global.css'));
import "../styles/globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}