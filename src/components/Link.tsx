import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LinkComponent = ({ children, skipLocaleHandling, ...rest }: any) => {
  const router = useRouter();
  const locale = rest.locale || router.query.locale || '';

  let href = rest.href || router.asPath;
  if (href.indexOf('http') === 0) skipLocaleHandling = true;
  if (locale && !skipLocaleHandling) {
    href = href ? `/${locale}${href}` : router.pathname.replace('[locale]', locale);
  }

  return (
    <>
      <Link href={href} className={rest.className}>
        {children}
      </Link>
    </>
  );
};

export default LinkComponent;
