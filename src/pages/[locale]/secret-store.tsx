import Icons from '@/components/Icons';
import StepperButton from '@/components/StepperButton';
import { useTranslation } from 'next-i18next';
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic';
import { useState } from 'react';
import { useRouter } from 'next/router';
import ExportedImage from 'next-image-export-optimizer';
import SubscribeForm from '@/components/SubscribeForm';

export default function SecretStore(props: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {

  const [email, setEmail] = useState('');

  const { t } = useTranslation(['common']);
  const router = useRouter();

  return (
    <div
      className="items-center flex h-screen w-full justify-center">
      <div className="fixed h-screen w-full overflow-hidden m-0">
        <ExportedImage
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
        <button
          onClick={router.back}
          className="absolute right-5 top-5">
          <Icons.close className="size-5 text-white" />
        </button>
        <SubscribeForm style={'dark'} />
        <p className="text-center text-xs text-white">
          {t('privacyPolicyAgreement')}
        </p>
      </div>
    </div>
  );
}


const getStaticProps = makeStaticProps(['common']);

export { getStaticPaths, getStaticProps };