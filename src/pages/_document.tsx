import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Dresses & things" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content="PLUM®" />
        <meta name="og:description" content="Dresses & things" />
        <meta name="og:image" content="https://plumplum.co/images/og.png" />
        <meta name="facebook-domain-verification" content="bahudlkogyzobajn9gkyr24k91b2iq" />
        <meta name="facebook-domain-verification" content="plqwge8ehbbmvwwvtaxcbhpvs36lc9" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
