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

export default function Checkout() {
  const {
    getCartItems,
    getCartTotal,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);
  const { t } = useTranslation(['checkout', 'common']);

  const [shippingOption, setShippingOption] = useState('standard');
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');

  const fetchDiscount = async () => {
    if (!promoCode) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
    setDiscount(10);
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');

  const [total, setTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(30);

  const [step, setStep] = useState<'bag' | 'deliveryInfo' | 'measurements'>(
    'bag',
  );

  const [isFormValid, setIsFormValid] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let total = getCartItems().reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    total += shippingCost;
    total -= (total * discount) / 100;
    setTotal(total);
  }, [shippingCost, discount]);


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
    await new Promise((resolve) => setTimeout(resolve, 600));
    await router.push('/orders/a1b2c3f4e5t6');
  };

  const [measurements, setMeasurements] = useState({
    height: '',
    sleeve: '',
    waist: '',
    chest: '',
    hips: '',
  });

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

  return (
    <div className="min-h-screen bg-white sm:bg-gray">
      {getCartTotal() > 0 ? (
        <div>
          <NavbarCart />
          <main className="mt-8 flex w-full items-start justify-center">
            <div className="flex w-full max-w-2xl flex-col rounded-xl bg-white sm:h-screen">
              {step == 'bag' && (
                <div className="flex flex-col rounded-t-xl bg-white p-5">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-lg sm:text-xl">
                      ${total} for {getCartTotal()} items
                    </p>
                    <button
                      className="h-8 text-gray-light"
                      onClick={() => clearCart()}>
                      {t('clearCart')}
                    </button>
                  </div>
                  <div className="mt-8 flex flex-col gap-5">
                    {getCartItems().map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-row items-center justify-between gap-3">
                        <div className="flex flex-row items-center gap-3">
                          <img
                            alt=""
                            className="size-10 rounded-full object-cover"
                            src="/images/thumb.png"
                          />
                          <div className="flex flex-col">
                            <p className="text-sm sm:text-base">
                              {item.name}{' '}
                              {item.quantity > 1 && `x ${item.quantity}`}
                            </p>
                            <p className="text-xs text-gray-light sm:text-sm ">
                              Total ${item.price}
                            </p>
                          </div>
                        </div>
                        <StepperButton
                          onIncrease={() => increaseQuantity(item.id)}
                          onDecrease={() => decreaseQuantity(item.id)}
                        />
                      </div>
                    ))}
                    <button
                      className="flex flex-row items-center justify-between text-start"
                      onClick={() => setStep('measurements')}>
                      <div className="flex flex-row items-center justify-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-gray">
                          <Icons.tShirt className="size-6" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base">
                            {isMeasurementsFilled()
                              ? t('measurementsAdded')
                              : t('addMeasurements')}
                          </p>
                          <p className="text-xs text-gray-light">
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
                    total={total}
                    measurementFilled={isMeasurementsFilled()}
                    discountPercent={discount}
                    discount={discount}
                    t={t}
                  />
                  <div
                    className="mt-10 flex w-full flex-col items-center justify-between gap-5 sm:flex-row sm:justify-start">
                    {discount == 0 ? (
                      <div className="flex h-11 w-full flex-row items-center rounded-lg bg-gray px-3">
                        <input
                          className="w-full bg-transparent focus:outline-none"
                          placeholder="Add promo-code"
                          type="text"
                          onInput={(e) =>
                            setPromoCode(e.currentTarget.value)
                          }
                        />
                        <button onClick={fetchDiscount}>Apply</button>
                      </div>
                    ) : (

                      <div
                        className="flex h-11 w-full flex-row items-center justify-between rounded-lg bg-light-green/10 px-3">
                        <div className="flex flex-row items-center justify-start gap-2.5">
                          <Icons.check className="size-4 fill-light-green text-light-green" />
                          <p className="text-sm text-light-green">
                            {discount}% {t('discountApplied')}
                          </p>
                        </div>
                        <button
                          className="text-light-green"
                          onClick={() => setDiscount(0)}>
                          <Icons.close className="size-4 fill-light-green" />
                        </button>
                      </div>
                    )}
                    <button
                      className="h-11 w-full flex-shrink-0 rounded-3xl bg-black text-white sm:w-56"
                      onClick={() => setStep('deliveryInfo')}>
                      {t('continue')} •{' '}
                      <span className="text-gray">${total}</span>
                    </button>
                  </div>
                </div>)}
              {step == 'deliveryInfo' && (
                <div
                  className="flex flex-col items-center rounded-t-xl bg-white p-5 text-center sm:items-start sm:text-start">
                  <p className="mb-1 text-lg text-black sm:text-xl">
                    {t('addDeliveryInfo')}
                  </p>
                  <p className="mb-8 text-sm text-gray-light">
                    {t('addDeliveryInfoDescription')}
                  </p>
                  <div className="mb-8 flex w-full flex-col gap-4">
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder={t('name')}
                      onInput={(e) => setName(e.currentTarget.value)}
                    />
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder={t('email')}
                      onInput={(e) => setEmail(e.currentTarget.value)}
                    />
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder={t('phone')}
                      onInput={(e) => setPhone(e.currentTarget.value)}
                    />
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder={t('country')}
                      onInput={(e) => setCountry(e.currentTarget.value)}
                    />
                    <div className="flex w-full flex-row items-center justify-start rounded-lg bg-gray">
                      <input
                        className="h-11 w-full bg-transparent px-3 text-sm focus:outline-neutral-200 sm:text-base"
                        placeholder={t('address')}
                        onInput={(e) => setAddress(e.currentTarget.value)}
                      />
                      <div className="h-8 w-0.5 bg-neutral-200"></div>
                      <input
                        className="h-11 w-24 bg-transparent px-3 text-sm focus:outline-neutral-200 sm:text-base"
                        placeholder={t('zip')}
                        onInput={(e) => setZip(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <Divider></Divider>
                  <div className="flex flex-col items-center p-5">
                    <TotalCostInfo
                      total={total}
                      measurementFilled={isMeasurementsFilled()}
                      discountPercent={discount}
                      discount={discount}
                      t={t}
                    />
                    <div className="mt-10 flex w-full flex-row items-center justify-between">
                      <button
                        className="h-11 w-24 rounded-3xl bg-gray text-black"
                        onClick={() => setStep('bag')}>
                        Back
                      </button>
                      <button
                        className={`h-11 w-56 flex-shrink-0 rounded-3xl text-white ${isFormValid ? 'bg-black' : 'bg-black/60 cursor-not-allowed'}`}
                        onClick={placeOrder}>
                        Checkout • <span className="text-gray">${total}</span>
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
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder="Height, cm"
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
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder="Sleeve length, cm"
                      type="number"
                      autoComplete="off"
                      autoCorrect="off"
                      value={measurements.sleeve}
                      onInput={(e) =>
                        updateMeasurements('sleeve', e.currentTarget.value)
                      }
                    />
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder="Waist, cm"
                      type="number"
                      autoComplete="off"
                      autoCorrect="off"
                      value={measurements.waist}
                      onInput={(e) =>
                        updateMeasurements('waist', e.currentTarget.value)
                      }
                    />
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder="Chest, cm"
                      type="number"
                      autoComplete="off"
                      autoCorrect="off"
                      value={measurements.chest}
                      onInput={(e) =>
                        updateMeasurements('chest', e.currentTarget.value)
                      }
                    />
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm focus:outline-neutral-200 sm:text-base"
                      placeholder="Hips, cm"
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
  discountPercent: number;
  discount: number;
  t: any;
}) => {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-sm text-gray-light sm:text-base">
          {props.t('subtotal')}
        </p>
        <p className="text-sm text-gray-light sm:text-base">${props.total}</p>
      </div>
      {props.discount > 0 && (
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-sm text-gray-light sm:text-base">
            {props.t('discount')}
          </p>
          <p className="text-sm text-gray-light sm:text-base">
            -${props.discount} ({props.discountPercent}%)
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
          {props.t('approx')} $30
        </p>
      </div>
      <div className="mt-4 flex w-full flex-row items-center justify-between">
        <p className="text-base text-black sm:text-lg">
          {props.t('total')}
        </p>
        <p className="text-base text-black sm:text-lg">${props.total}</p>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-xs text-gray-light">{props.t('agree')}</p>
        <Icons.infoCircle className="size-3.5" />
      </div>
    </div>
  );
};

const getStaticProps = makeStaticProps(['checkout', 'common']);

export { getStaticPaths, getStaticProps };