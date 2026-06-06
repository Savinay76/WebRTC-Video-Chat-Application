import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MeshCall — WebRTC Video Chat',
  description:
    'A production-ready multi-peer WebRTC video chat application with real-time communication, text chat, and mesh topology support.',
  keywords: ['WebRTC', 'video chat', 'real-time', 'peer-to-peer', 'mesh topology'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
