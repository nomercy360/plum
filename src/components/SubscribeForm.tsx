import Icons from '@/components/Icons';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';

export default function SubscribeForm(props: { style: 'dark' | 'light' }) {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const subscribe = async () => {
    if (!emailRegex.test(email)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 700));

    setEmailSent(true);
  };

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const { t } = useTranslation('common');

  return (
    <div
      className={`flex max-w-md flex-col items-center justify-center p-8 text-center ${props.style === 'dark' ? 'text-white' : 'text-black'}`}>
      <div className="flex flex-row items-center gap-2">
        <Icons.logo
          className={`h-6 w-24 sm:w-32 ${props.style === 'dark' ? 'text-white' : 'text-black'}`}
        />
        <span className="text-xl">{t('secretStore')}</span>
      </div>
      <p className="mt-3 text-base sm:mt-4">{t('secretStoreDescription')}</p>
      {emailSent ? (
        <div
          className="mt-5 flex h-14 w-full flex-row items-center justify-between rounded-lg bg-light-green p-3 sm:mt-8">
          <div className="flex flex-row items-center justify-start gap-2.5">
            <Icons.check className="size-4 fill-white text-white" />
            <p className="text-sm text-white">{t('subscribed')}</p>
          </div>
          <button className="p-2 text-white" onClick={() => setEmailSent(false)}>
            <Icons.close className="size-4 fill-white" />
          </button>
        </div>
      ) : (
        <div className="mt-5 flex h-14 w-full flex-row items-center justify-between rounded-xl bg-gray p-3 sm:mt-8">
          <input
            type="email"
            placeholder={t('email')}
            onInput={(e: any) => setEmail(e.target.value)}
            className="w-full bg-transparent text-black placeholder:text-dark-gray focus:outline-none"
          />
          {email && (
            <button
              className="text-base uppercase text-dark-gray"
              onClick={subscribe}>
              {t('subscribe')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
