import Icons from '@/components/Icons';
import StepperButton from '@/components/StepperButton';
import { useTranslation } from 'next-i18next';
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic';
import { useState } from 'react';
import { useRouter } from 'next/router';
import ExportedImage from 'next-image-export-optimizer';
import Head from 'next/head';

export default function GiftCard(props: { isOpen: boolean; setIsOpen: (value: boolean) => void }) {
  const { t } = useTranslation(['common']);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [receivingDate, setReceivingDate] = useState('');
  const [receivingTime, setReceivingTime] = useState('');
  const [amount, setAmount] = useState(100);

  const increaseAmount = () => {
    if (amount >= 1000) return;
    setAmount(amount + 50);
  };

  const decreaseAmount = () => {
    if (amount <= 50) return;
    setAmount(amount - 50);
  };

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
          <ExportedImage
            alt="Mountains"
            src="/images/gift-card/bg.png"
            placeholder="blur"
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <div
          className="relative flex h-full min-h-fit w-full flex-col items-center justify-between bg-cover bg-center px-5 py-7 sm:rounded-t-2xl">
          <button onClick={router.back} className="absolute right-5 top-5">
            <Icons.close className="size-5 text-white" />
          </button>
          <div className="flex max-w-sm flex-col items-center justify-center text-center">
            <div className="flex flex-row items-center gap-2 text-white">
              <Icons.logo className="h-6 w-24 text-white sm:w-32" />
              <span className="text-xl">{t('gift')}</span>
            </div>
            <p className="mt-2.5 text-sm text-white sm:text-base">{t('giftCardDescription')}</p>
            <div className="mt-14 flex w-[280px] flex-col items-center gap-4">
              <input
                className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                placeholder={t('yourEmail')}
                value={email}
                onInput={e => setEmail(e.currentTarget.value)}
              />
              <input
                className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                placeholder={t('recipientEmail')}
                value={recipientEmail}
                onInput={e => setRecipientEmail(e.currentTarget.value)}
              />
              <input
                className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                placeholder={t('receivingDate')}
                value={receivingDate}
                onInput={e => setReceivingDate(e.currentTarget.value)}
              />
              <input
                className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                placeholder={t('receivingTime')}
                value={receivingTime}
                onInput={e => setReceivingTime(e.currentTarget.value)}
              />
              <div className="flex h-11 w-full flex-row items-center justify-between rounded-lg bg-white pl-3 pr-1.5">
                <p className="text-sm text-black sm:text-base">${amount}</p>
                <StepperButton onIncrease={increaseAmount} onDecrease={decreaseAmount} />
              </div>
              <button className="mt-4 h-11 w-full rounded-3xl bg-gray text-sm text-black sm:text-base">
                {t('checkout')} ${amount}
              </button>
            </div>
          </div>
          <p className="mb-8 max-w-xs text-center text-xs text-white">{t('giftCardTerms')}</p>
        </div>
      </div>
    </>
  );
}

const getStaticProps = makeStaticProps(['common']);

export { getStaticPaths, getStaticProps };
