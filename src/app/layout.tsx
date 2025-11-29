import type { Metadata } from 'next';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { TRPCProvider } from '@/lib/trpc/provider';
import { theme } from '@/lib/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shorthack',
  description: 'Simple one-page app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <TRPCProvider>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}

