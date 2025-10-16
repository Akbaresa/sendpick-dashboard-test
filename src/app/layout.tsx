import { ReactNode } from 'react';
import Head from 'next/head';
import { AuthProvider } from '@/core/context/AuthContext';
import Script from 'next/script';
export const metadata = {
  title: 'SendPick Dashboard',
  description: 'Mini Dashboard SendPick',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/images/favicon.svg" type="image/x-icon" />

        {/* Page specific CSS */}
        <link href="/css/plugins/animate.min.css" rel="stylesheet" type="text/css" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
          rel="stylesheet"
        />

        {/* Fonts */}
        <link rel="stylesheet" href="/fonts/inter/inter.css" id="main-font-link" />
        <link rel="stylesheet" href="/fonts/phosphor/duotone/style.css" />
        <link rel="stylesheet" href="/fonts/tabler-icons.min.css" />
        <link rel="stylesheet" href="/fonts/feather.css" />
        <link rel="stylesheet" href="/fonts/fontawesome.css" />
        <link rel="stylesheet" href="/fonts/material.css" />
        <link rel="stylesheet" href="/fonts/inter/inter.css" />

        {/* Template CSS */}
        <link rel="stylesheet" href="/css/style.css" id="main-style-link" />
        <link rel="stylesheet" href="/css/plugins/style.css" />
        <link rel="stylesheet" href="/css/style-preset.css" />
        <link rel="stylesheet" href="/css/landing.css" />
        <link rel="stylesheet" href="/css/custom.css" />

      </head>
      <body
        data-pc-preset="preset-1"
        data-pc-sidebar-caption="true"
        data-pc-layout="vertical"
        data-pc-direction="ltr"
        data-pc-theme_contrast=""
        data-pc-theme="light"
      >

        <AuthProvider>{children}</AuthProvider>
            {/* Plugins */}
        <Script src="/js/plugins/popper.min.js" strategy="beforeInteractive" />
        <Script src="/js/plugins/simplebar.min.js" strategy="beforeInteractive" />
        <Script src="/js/plugins/bootstrap.min.js" strategy="beforeInteractive" />

        <Script src="/js/plugins/i18next.min.js" strategy="afterInteractive" />
        <Script src="/js/plugins/i18nextHttpBackend.min.js" strategy="afterInteractive" />

        <Script src="/js/icon/custom-font.js" strategy="afterInteractive" />
        <Script src="/js/script.js" strategy="afterInteractive" />
        <Script src="/js/theme.js" strategy="afterInteractive" />
        <Script src="/js/multi-lang.js" strategy="afterInteractive" />
        <Script src="/js/plugins/feather.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
