import Icons from '@/components/Icons';
import { useTranslation } from 'next-i18next';
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic';
import { useRouter } from 'next/router';
import SubscribeForm from '@/components/SubscribeForm';
import Head from 'next/head';
import Image from 'next/image';

export default function SecretStore(props: { isOpen: boolean; setIsOpen: (value: boolean) => void }) {
  const { t } = useTranslation(['common']);
  const router = useRouter();

  return (
    <>
      <Head>
        <meta name="og:title" content="PLUM®" />
        <meta name="og:description" content="Dresses & things" />
        <meta name="og:image" content="https://plumplum.co/images/og.png" />
        <meta name="description" content="Dresses & things" />
      </Head>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="fixed m-0 h-screen w-full overflow-hidden">
          <Image
            alt="Mountains"
            src="/images/secret-store/bg.png"
            placeholder="blur"
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <div
          className="relative flex h-full min-h-fit w-full flex-col items-center justify-center bg-cover bg-center px-5 py-7 sm:rounded-t-2xl">
          <button onClick={router.back} className="absolute right-5 top-5">
            <Icons.close className="size-5 text-white" />
          </button>
          <SubscribeForm style={'dark'} />
          <p className="text-center text-xs text-white">{t('privacyPolicyAgreement')}</p>
        </div>
      </div>
    </>
  );
}

const getStaticProps = makeStaticProps(['common']);

export { getStaticPaths, getStaticProps };
