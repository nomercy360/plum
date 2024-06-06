import languageDetector from '../lib/languageDetector';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Icons from '@/components/Icons';
import { createContext, useContext } from 'react';
import { LocaleContext } from '@/context/locale-provider';

const LanguageSwitchLink = ({ ...rest }: any) => {
  const router = useRouter();
  const { toggleCurrency } = useContext(LocaleContext);

  let href = rest.href || router.asPath;
  let pName = router.pathname;
  const locale = router.query.locale === 'en' ? 'ru' : 'en';

  Object.keys(router.query).forEach((k) => {
    if (k === 'locale') {
      pName = pName.replace(`[${k}]`, locale);
      return;
    }
    // @ts-ignore
    pName = pName.replace(`[${k}]`, router.query[k]);
  });

  if (locale) {
    href = rest.href ? `/${locale}${rest.href}` : pName;
  }

  const onClick = () => {
    // @ts-ignore
    languageDetector.cache(locale);
    toggleCurrency();
  };

  return (
    <Link
      href={href}
      onClick={() => onClick()}
    >
      <Icons.translate
        className={`h-5 w-5 sm:h-6 sm:w-6 text-black ${rest.theme === 'dark' ? 'text-white' : 'text-black'}`}
      />
    </Link>
  );
};

export default LanguageSwitchLink;