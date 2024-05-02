import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation, UserConfig } from 'next-i18next';
import nextI18NextConfig from '../../next-i18next.config.js';
import CartProvider from '@/context/cart-provider';
import localFont from 'next/font/local';

const emptyInitialI18NextConfig: UserConfig = {
  i18n: {
    defaultLocale: nextI18NextConfig.i18n.defaultLocale,
    locales: nextI18NextConfig.i18n.locales,
  },
};

const baseFont = localFont({ src: './PPPangramSansRounded-NarrowSemibold.woff2' });

function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <style jsx global>{`
          html {
              font-family: ${baseFont.style.fontFamily};
          }
      `}</style>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default appWithTranslation(App, emptyInitialI18NextConfig);
