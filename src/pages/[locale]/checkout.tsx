import Icons from '@/components/Icons';
import Divider from '@/components/Divider';
import EmptyCart from '@/components/EmptyCart';
import NavbarCart from '@/components/NavbarCart';
import StepperButton from '@/components/StepperButton';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/context/cart-provider';
import { useTranslation } from 'next-i18next';
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic';
import { useRouter } from 'next/router';
import ExportedImage from 'next-image-export-optimizer';
import { LocaleContext } from '@/context/locale-provider';
import Link from '@/components/Link';

import countries from '@/lib/countries.json';


type Measurements = {
  height?: string;
  sleeve?: string;
  waist?: string;
  chest?: string;
  hips?: string;
};

async function checkoutRequest(data: any, locale: string = 'en') {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': locale,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 201) {
    return response.json();
  } else {
    throw new Error('Error fetching checkout');
  }
}

export default function Checkout() {
  const {
    cart,
    getCartItems,
    clearCart,
    updateCartItem,
    applyDiscount,
  } = useContext(CartContext);

  const {
    currency, currencySign, currentLanguage,
  } = useContext(LocaleContext);


  const { t } = useTranslation(['checkout', 'common']);

  const [shippingOption, setShippingOption] = useState('standard');
  const [promoCode, setPromoCode] = useState('');

  const fetchDiscount = async () => {
    if (!promoCode) return;
    applyDiscount(promoCode);
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');

  const [shippingCost, setShippingCost] = useState(30);

  const [step, setStep] = useState<'bag' | 'deliveryInfo' | 'measurements'>(
    'bag',
  );

  const [isFormValid, setIsFormValid] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setShippingCost(shippingOption === 'standard' ? 30 : 50);
  }, [shippingOption]);

  useEffect(() => {
    const isValid =
      name !== '' &&
      email !== '' &&
      address !== '' &&
      country !== '' &&
      zip !== '' &&
      phone !== '';

    setIsFormValid(isValid);
  }, [name, email, address, country, zip, phone]);


  const placeOrder = async () => {
    const order = {
      name,
      email,
      address,
      country,
      zip,
      phone,
      provider: 'bepaid',
      cart_id: cart.id,
      metadata: {
        measurements,
      },
    };

    const resp = await checkoutRequest(order, currentLanguage);
    // get payment_link and redirect to it in new tab

    window.open(resp.payment_link, '_blank');
  };

  const [measurements, setMeasurements] = useState<Measurements>({} as Measurements);

  const updateMeasurements = (key: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  const afterMeasurements = (save: boolean) => {
    if (!save) {
      setMeasurements({
        height: '',
        sleeve: '',
        waist: '',
        chest: '',
        hips: '',
      });
    }

    setStep('bag');
  };

  const isMeasurementsFilled = () => {
    return Object.values(measurements).some((value) => value !== '');
  };

  function getWordEnding(count: number) {
    if (count % 10 === 1 && count % 100 !== 11) {
      return 'товар';
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return 'товара';
    } else {
      return 'товаров';
    }
  }

  function getTranslation(key: string, count: number) {
    const translation = t(key, { total: count });
    const ending = getWordEnding(count);
    return translation.replace('{{ending}}', ending);
  }

  return (
    <div className="min-h-screen bg-white sm:bg-gray">
      {cart.count > 0 ? (
        <div>
          <NavbarCart>
            <button onClick={() => router.back()}>
              <Icons.close className="size-5 fill-black" />
            </button>
          </NavbarCart>
          <main className="mt-8 flex w-full items-start justify-center">
            <div className="flex w-full max-w-2xl flex-col rounded-xl bg-white sm:h-screen">
              {step == 'bag' && (
                <div className="w-full flex flex-col rounded-t-xl bg-white">
                  <div className="flex flex-row items-center justify-between  p-5">
                    <p className="text-lg sm:text-xl">
                      {getTranslation('yourBag', cart.count)}
                    </p>
                    <button
                      className="h-8 text-gray-light"
                      onClick={() => clearCart()}>
                      {t('clearCart')}
                    </button>
                  </div>
                  <div className="mt-8 flex flex-col gap-5 p-5">
                    {getCartItems().map((item) => (
                      <div
                        key={item.variant_id}
                        className="flex flex-row items-center justify-between gap-3">
                        <div className="flex flex-row items-center gap-3">
                          <ExportedImage
                            alt=""
                            className="size-10 rounded-full object-cover shrink-0"
                            src={item.image_url}
                            width={40}
                            height={40}
                          />
                          <div className="flex flex-col">
                            <p className="text-sm sm:text-base">
                              {item.product_name}{' '}{`(${item.variant_name})`}{' '}
                              {item.quantity > 1 && `x ${item.quantity}`}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-light sm:text-sm">
                              Total {item.price}{cart.currency}
                            </p>
                          </div>
                        </div>
                        <StepperButton
                          onIncrease={() => updateCartItem(
                            item.id,
                            item.quantity + 1,
                          )}
                          onDecrease={() => updateCartItem(
                            item.id,
                            item.quantity - 1,
                          )}
                        />
                      </div>
                    ))}
                    <button
                      className="flex flex-row items-center justify-between text-start"
                      onClick={() => setStep('measurements')}>
                      <div className="flex flex-row items-center justify-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-gray shrink-0">
                          <Icons.tShirt className="size-6" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base">
                            {isMeasurementsFilled()
                              ? t('measurementsAdded')
                              : t('addMeasurements')}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-light">
                            {isMeasurementsFilled()
                              ? t('measurementsAddedDescription')
                              : t('addMeasurementsDescription')}
                          </p>
                        </div>
                      </div>
                      <div className="flex h-10 items-center justify-center px-2">
                        <Icons.arrowRight className="h-3 w-2.5" />
                      </div>
                    </button>
                  </div>
                  <Divider></Divider>
                  <div className="flex flex-col items-center p-5"></div>
                  <TotalCostInfo
                    total={cart.total}
                    measurementFilled={isMeasurementsFilled()}
                    discountPercent={cart.discount?.value || 0}
                    subtotal={cart.subtotal}
                    t={t}
                    currencySign={currencySign}
                  />
                  <div
                    className="p-5 mt-10 flex w-full flex-col items-center justify-between gap-5 sm:flex-row sm:justify-start">
                    {!cart.discount ? (
                      <div className="flex h-11 w-full flex-row items-center rounded-lg bg-gray px-3">
                        <input
                          className="w-full bg-transparent focus:outline-none"
                          placeholder={t('addPromoCode')}
                          type="text"
                          onInput={(e) =>
                            setPromoCode(e.currentTarget.value)
                          }
                        />
                        <button onClick={fetchDiscount}>
                          {t('apply')}
                        </button>
                      </div>
                    ) : (
                      <div
                        className="flex h-11 w-full flex-row items-center justify-between rounded-lg bg-light-green/10 px-3">
                        <div className="flex flex-row items-center justify-start gap-2.5">
                          <Icons.check className="size-4 fill-light-green text-light-green" />
                          <p className="text-sm text-light-green">
                            {cart.discount.value}% {t('discountApplied')}
                          </p>
                        </div>
                        <button
                          className="text-light-green"
                          onClick={() => applyDiscount('')}>
                          <Icons.close className="size-4 fill-light-green" />
                        </button>
                      </div>
                    )}
                    <button
                      className="h-11 w-full flex-shrink-0 rounded-3xl bg-black text-white sm:w-56"
                      onClick={() => setStep('deliveryInfo')}>
                      {t('continue')} •{' '}
                      <span className="text-gray">{cart.total}{cart.currency}</span>
                    </button>
                  </div>
                </div>)}
              {step == 'deliveryInfo' && (
                <div
                  className="flex flex-col items-center rounded-t-xl bg-white text-center sm:items-start sm:text-start sm:pb-0 pb-10">
                  <p className="px-5 pt-5 mb-1 text-lg text-black sm:text-xl">
                    {t('addDeliveryInfo')}
                  </p>
                  <p className="px-5 mb-8 text-sm text-gray-light">
                    {t('addDeliveryInfoDescription')}
                  </p>
                  <div className="px-5 mb-8 flex w-full flex-col gap-4">
                    <input
                      className="placeholder:text-dark-gray h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder={t('name')}
                      autoFocus
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="words"
                      required
                      onInput={(e) => setName(e.currentTarget.value)}
                    />
                    <input
                      className="placeholder:text-dark-gray h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder={t('email')}
                      type="email"
                      autoComplete="email"
                      autoCorrect="off"
                      autoCapitalize="off"
                      required
                      onInput={(e) => setEmail(e.currentTarget.value)}
                    />
                    <input
                      className="placeholder:text-dark-gray h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      type="tel"
                      autoComplete="tel"
                      placeholder={t('phone')}
                      onInput={(e) => setPhone(e.currentTarget.value)}
                    />
                    <div className="flex w-full flex-row items-center justify-start rounded-lg bg-gray">
                      <select
                        className="h-11 w-full bg-transparent px-3 text-sm focus:outline-neutral-200 sm:text-base"
                        onChange={(e) => setCountry(e.currentTarget.value)}
                        value={country}>
                        <option value="">{t('country')}</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex w-full flex-row items-center justify-start rounded-lg bg-gray">
                      <input
                        autoComplete="address"
                        className="placeholder:text-dark-gray h-11 w-full bg-transparent px-3 text-sm focus:outline-neutral-200 sm:text-base"
                        placeholder={t('address')}
                        onInput={(e) => setAddress(e.currentTarget.value)}
                      />
                      <div className="h-8 w-0.5 bg-dark-gray"></div>
                      <input
                        autoComplete="postal-code"
                        className="placeholder:text-dark-gray h-11 w-24 bg-transparent px-3 text-sm focus:outline-neutral-200 sm:text-base"
                        placeholder={t('zip')}
                        onInput={(e) => setZip(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <Divider></Divider>
                  <div className="w-full flex flex-col items-center">
                    <TotalCostInfo
                      total={cart.total}
                      measurementFilled={isMeasurementsFilled()}
                      discountPercent={cart.discount?.value || 0}
                      subtotal={cart.subtotal}
                      t={t}
                      currencySign={currencySign}
                    />
                    <div className="mt-10 flex w-full flex-row items-center justify-center sm:justify-between px-5">
                      <button
                        className="h-11 w-24 rounded-3xl bg-gray text-black sm:block hidden"
                        onClick={() => setStep('bag')}>
                        {t('back')}
                      </button>
                      <button
                        className={`h-11 w-56 flex-shrink-0 rounded-3xl text-white ${isFormValid ? 'bg-black' : 'bg-black/60 cursor-not-allowed'}`}
                        disabled={!isFormValid}
                        onClick={placeOrder}>
                        {t('checkout')} <span className="text-gray">{cart.total}{currencySign}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step == 'measurements' && (
                <div
                  className="flex flex-col items-center rounded-t-xl bg-white p-5 text-center sm:items-start sm:text-start">
                  <p className="mb-1 text-lg text-black sm:text-xl">
                    {t('addMeasurements')}
                  </p>
                  <p className="mb-8 max-w-xs text-sm text-gray-light sm:max-w-4xl">
                    {t('addMeasurementsDescription2')}
                  </p>
                  <div className="mb-8 flex w-full flex-col gap-4">
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base placeholder:text-dark-gray"
                      placeholder={t('height')}
                      type="number"
                      autoFocus
                      autoComplete="off"
                      autoCorrect="off"
                      value={measurements.height}
                      onInput={(e) =>
                        updateMeasurements('height', e.currentTarget.value)
                      }
                    />
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base placeholder:text-dark-gray"
                      placeholder={t('sleeve')}
                      type="number"
                      autoComplete="off"
                      autoCorrect="off"
                      value={measurements.sleeve}
                      onInput={(e) =>
                        updateMeasurements('sleeve', e.currentTarget.value)
                      }
                    />
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base placeholder:text-dark-gray"
                      placeholder={t('waist')}
                      type="number"
                      autoComplete="off"
                      autoCorrect="off"
                      value={measurements.waist}
                      onInput={(e) =>
                        updateMeasurements('waist', e.currentTarget.value)
                      }
                    />
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base placeholder:text-dark-gray"
                      placeholder={t('chest')}
                      type="number"
                      autoComplete="off"
                      autoCorrect="off"
                      value={measurements.chest}
                      onInput={(e) =>
                        updateMeasurements('chest', e.currentTarget.value)
                      }
                    />
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base placeholder:text-dark-gray"
                      placeholder={t('hips')}
                      type="number"
                      autoComplete="off"
                      autoCorrect="off"
                      value={measurements.hips}
                      onInput={(e) =>
                        updateMeasurements('hips', e.currentTarget.value)
                      }
                    />
                  </div>
                  <div
                    className="mt-10 flex w-full sm:max-w-none max-w-[220px] flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
                    <button
                      className="h-11 w-full rounded-3xl bg-gray text-black sm:w-24"
                      onClick={() => afterMeasurements(false)}>
                      {t('skip')}
                    </button>
                    <button
                      className="h-11 w-full flex-shrink-0 rounded-3xl bg-black text-white sm:w-56"
                      onClick={() => afterMeasurements(true)}>
                      {t('saveMeasurements')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>);
}


const TotalCostInfo = (props: {
  total: number;
  measurementFilled: boolean;
  subtotal: number;
  discountPercent: number;
  t: any;
  currencySign: string;
}) => {
  const discount = props.subtotal - props.total;

  return (
    <div className="p-5 flex w-full flex-col gap-3">
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-sm text-gray-light sm:text-base">
          {props.t('subtotal')}
        </p>
        <p className="text-sm text-gray-light sm:text-base">{props.total}{props.currencySign}</p>
      </div>
      {props.discountPercent > 0 && (
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-sm text-gray-light sm:text-base">
            {props.t('discount')}
          </p>
          <p className="text-sm text-gray-light sm:text-base">
            -{discount}{props.currencySign} ({props.discountPercent}%)
          </p>
        </div>
      )}
      {props.measurementFilled && (
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-sm text-gray-light sm:text-base">
            {props.t('customTailoring')}
          </p>
          <p className="text-sm text-gray-light sm:text-base">
            {props.t('free')}
          </p>
        </div>
      )}
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-sm text-gray-light sm:text-base">
          {props.t('worldwide')}
        </p>
        <p className="text-sm text-gray-light sm:text-base">
          {props.t('approx')} 30{props.currencySign}
        </p>
      </div>
      <div className="mt-4 flex w-full flex-row items-center justify-between">
        <p className="text-base text-black sm:text-lg">
          {props.t('total')}
        </p>
        <p className="text-base text-black sm:text-lg">{props.total}{props.currencySign}</p>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-xs text-gray-light sm:text-center text-start">{props.t('agree')}</p>
        <Link href="/terms">
          <Icons.infoCircle className="size-3.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
};

const getStaticProps = makeStaticProps(['checkout', 'common']);

export { getStaticPaths, getStaticProps };
