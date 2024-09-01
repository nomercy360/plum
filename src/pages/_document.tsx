import { Html, Head, Main, NextScript } from 'next/document';

declare global {
  interface Window {
    // @ts-ignore
    dataLayer: any[];
  }
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="facebook-domain-verification" content="bahudlkogyzobajn9gkyr24k91b2iq" />
        <meta name="facebook-domain-verification" content="plqwge8ehbbmvwwvtaxcbhpvs36lc9" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://load.gtm.plumplum.co/mtsvlhoy.js?st='+i+dl+'';f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','PNZ4JMKQ');
            `,
          }}
        />
      </Head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
          <iframe src="https://load.gtm.plumplum.co/ns.html?id=GTM-PNZ4JMKQ" height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
