import Icons from '@/components/Icons';
import SubscribeForm from '@/components/SubscribeForm';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { getStaticPaths, makeStaticProps } from '@/lib/getStatic';


export default function SecretStore(props: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {

  const [email, setEmail] = useState('');

  const { t } = useTranslation(['common']);

  const router = useRouter();

  return (
    <div
      className="items center fixed left-0 top-0 z-50 flex h-screen w-full justify-center overflow-auto bg-white sm:pt-28">
      <div
        className="relative flex h-full min-h-fit w-full max-w-7xl flex-col items-center justify-between bg-[url(/images/secret-store-bg-mobile.webp)] bg-cover bg-center px-5 py-7 sm:rounded-t-2xl sm:bg-[url(/images/secret-store-bg.webp)]">
        <button
          onClick={() => router.back()}
          className="absolute right-5 top-5">
          <Icons.close className="size-5 text-white" />
        </button>
        <SubscribeForm style={'dark'} />
        <p className="text-center text-xs text-black">
          {t('privacyPolicyAgreement')}
        </p>
      </div>
    </div>
  );
}


const getStaticProps = makeStaticProps(['common']);

export { getStaticPaths, getStaticProps };
