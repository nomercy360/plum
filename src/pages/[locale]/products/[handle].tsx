import PhotoGallery from '@/components/PhotoGallery';
import Navbar from '@/components/Navbar';
import { products } from '@/lib/api';
import Footer from '@/components/Footer';
import ProductRecommendations from '@/components/ProductRecommendations';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/context/cart-provider';
import Link from '@/components/Link';
import { useTranslation } from 'next-i18next';
import { Product } from '@/pages/[locale]';
import { getI18nProps } from '@/lib/getStatic';
import i18nextConfig from '../../../../next-i18next.config';


export default function ProductPage({ product }: { product: Product }) {
  const { t } = useTranslation(['product', 'common']);
  const { addToCart } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [wasAddedToCart, setWasAddedToCart] = useState(false);

  const handleAddToCart = () => {
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: selectedSize,
    };

    addToCart(item);
    setWasAddedToCart(true);
  };

  useEffect(() => {
    if (product.sizes) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const chooseSize = (size: string) => {
    setSelectedSize(size);

    if (wasAddedToCart) {
      setWasAddedToCart(false);
    }
  };

  return (
    <div>
      <main
        className={`mb-12 flex min-h-screen flex-col items-center justify-between bg-white sm:mb-28`}>
        <Navbar theme={'light'} />
        <div className="mt-0 flex max-w-[1440px] flex-col gap-10 px-5 sm:mt-28 sm:flex-row sm:px-14">
          {product.images && (<PhotoGallery images={product.images} />)}
          <div
            className="flex w-full flex-col items-start text-start text-black sm:w-[360px] sm:min-w-[360px]">
            <div
              className="mb-3 flex h-6 items-center justify-center rounded-full bg-violet/10 px-2 text-xs uppercase text-violet">
              {t('piecesLeft')}
            </div>
            <p className="mb-1 text-lg text-black sm:text-xl">{product.name} </p>
            <p className="text-sm text-gray-light sm:text-base">
              {product.description}
            </p>
            <div className="mt-5 flex h-9 w-full flex-row items-center justify-between sm:h-10">
              <div className="flex flex-row items-center justify-start gap-1 text-xs sm:text-base">
                {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      className={`flex size-11 items-center justify-center rounded-full uppercase ${size === selectedSize ? 'text-white bg-black' : 'text-dark-gray bg-gray'}`}
                      onClick={() => chooseSize(size)}>
                      {size}
                    </button>
                  ),
                )}
              </div>
              {!wasAddedToCart ? (
                <button
                  className="flex h-11 min-w-[140px] flex-row items-center justify-between gap-2 rounded-full bg-button px-3.5 text-base text-white"
                  onClick={handleAddToCart}>
                  <p className="text-white">{t('addToBag')}</p>
                  <p className="text-gray-light">${product.price}</p>
                </button>
              ) : (

                <div
                  className="flex h-11 min-w-[140px] flex-row items-center justify-center gap-2 rounded-full bg-light-green px-3.5 text-base text-white">
                  <p className="text-white">{t('added')}</p>
                </div>
              )}
            </div>
            <p className="mt-10 text-sm uppercase text-black sm:mt-14 sm:text-base">
              {t('fitsPerfectly')}
            </p>
            <p className="mt-2 text-sm text-gray-light sm:text-base">
              {t('sizeAdvice')}
            </p>
            <p className="mt-5 text-sm uppercase text-black sm:text-base">
              {t('worldwideDelivery')}
            </p>
            <p className="mt-2 text-sm text-gray-light sm:text-base">
              {t('deliveryDetails')}
            </p>
            <p className="mt-5 text-sm uppercase text-black sm:text-base">
              {t('freeReturns')}
            </p>
            <p className="mt-2 text-sm text-gray-light sm:text-base">
              {t('returnPolicy')}
            </p>
            <p className="mt-5 text-sm uppercase text-black sm:text-base">
              {t('easyToCare')}
            </p>
            <p className="mt-2 text-sm text-gray-light sm:text-base">
              {t('careInstructions')}
            </p>
            <Link href="/secret-store"
                  className="w-full mt-5 flex h-10 flex-row items-center justify-between rounded-3xl px-3 bg-violet/10">
              <span className="text-sm text-black">{t('newsletterDiscount')}</span>
              <span className="text-sm text-violet">{t('subscribe')}</span>
            </Link>
          </div>
        </div>
        <section className="mt-14 flex w-full flex-col items-center justify-center sm:mt-24 sm:max-w-[1440px]">
          <p className="mb-2 text-sm uppercase sm:mb-12 sm:text-base">
            {t('youMayAlsoLike')}
          </p>
          <ProductRecommendations products={products.slice(0, 4)} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export const getStaticPaths = () => {
  const getPaths = () =>
    i18nextConfig.i18n.locales.flatMap((locale) =>
      products.map((product) => ({
        params: { locale, handle: product.handle },
      })),
    );

  return {
    fallback: false,
    paths: getPaths(),
  };
};

export const getStaticProps = async (ctx: any) => {
  return {
    props: {
      ...(await getI18nProps(ctx, [
        'product',
        'common',
      ])),
      product: products.find((product) => product.handle === ctx.params.handle),
    },
  };
};
