import languageDetector from '../lib/languageDetector';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Icons from '@/components/Icons';
import { createContext, useContext } from 'react';
import { LocaleContext } from '@/context/locale-provider';

const LanguageSwitchLink = ({ ...rest }: any) => {
  const router = useRouter();
  const { toggleCurrency, currency } = useContext(LocaleContext);

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
      className="flex flex-row gap-1 items-center justify-start rounded-full"
    >
      <span className="sr-only">Switch language</span>
      <span className="uppercase text-black">{currency}</span>
      <span className="bg-black rounded-full size-5 flex items-center justify-center">
        <Icons.translate
          className={`size-2.5 text-white`}
        />
      </span>
    </Link>
  );
};

export default LanguageSwitchLink;
