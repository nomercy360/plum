import PhotoGallery from '@/components/PhotoGallery';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductRecommendations from '@/components/ProductRecommendations';
import { useContext, useEffect, useMemo, useState } from 'react';
import { CartContext } from '@/context/cart-provider';
import Link from '@/components/Link';
import { useTranslation } from 'next-i18next';
import { fetchProducts, Product } from '@/pages/[locale]';
import { getI18nProps } from '@/lib/getStatic';
import i18nextConfig from '../../../../next-i18next.config';
import Head from 'next/head';

export default function ProductPage({ product }: { product: Product }) {
  const { t } = useTranslation(['product', 'common']);
  const { addToCart, cart } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState<number>(0);
  const [wasAddedToCart, setWasAddedToCart] = useState(false);

  const { currency } = useContext(CartContext);

  const [currencyCode, currencySymbol, price] = useMemo(() => {
    const price = product.prices.find(price => price.currency_code === currency);
    if (!price) return [product.prices[0].currency_code, product.prices[0].currency_symbol, product.prices[0].price];
    return [price.currency_code, price.currency_symbol, price.price];
  }, [product, currency]);

  const handleAddToCart = () => {
    const item = {
      product_id: product.id,
      quantity: 1,
      variant_id: selectedSize,
    };

    addToCart(item);
    setWasAddedToCart(true);

    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: currencyCode,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: 'Dresses',
            item_brand: 'Plum',
            price: price,
            quantity: 1,
          },
        ],
      },
    });
  };

  useEffect(() => {
    if (product.variants) {
      setSelectedSize(product.variants[0].id);
    }
  }, [product]);

  const chooseSize = (size: number) => {
    setSelectedSize(size);

    if (wasAddedToCart) {
      setWasAddedToCart(false);
    }
  };

  useEffect(() => {
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        currency: currencyCode,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: 'Dresses',
            item_brand: 'Plum',
            price: price,
            quantity: 1,
          },
        ],
      },
    });
  }, [product]);

  const isVariantInCart = useMemo(() => {
    return cart.items?.some(item => item.variant_id === selectedSize);
  }, [cart, selectedSize]);

  const availability = useMemo(() => {
    return product.variants.find(variant => variant.id === selectedSize)?.available;
  }, [product, selectedSize]);

  const priceToString = (price: number, currencySymbol: string) => {
    return currencySymbol === '$' ? `$${price}` : `${price} ${currencySymbol}`;
  };

  return (
    <div>
      <Head>
        <title>{product.name} | PLUM®</title>
        <meta name="og:title" content={`PLUM® | ${product.name}. Available for ${price}${currencyCode}`} />
        <meta name="og:description" content={product.description} />
        <meta name="og:image" content={product.images[0]} />
        <meta name="description" content={product.description} />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <main className={`mb-12 flex min-h-screen flex-col items-center justify-between bg-white sm:mb-28`}>
        <Navbar />
        <div className="mt-4 flex max-w-[1440px] flex-col gap-10 px-5 sm:mt-14 sm:flex-row sm:px-14">
          {product.images && <PhotoGallery images={product.images} />}
          <div className="flex w-full flex-col items-start text-start text-black sm:w-[360px] sm:min-w-[360px]">
            <div className="mb-3 flex h-6 items-center justify-center rounded-full bg-violet/10 px-2 pt-px text-xs uppercase tracking-wide text-violet">
              {availability &&
                availability > 1 &&
                availability < 3 &&
                t('piecesLeft', { count: product.variants.find(variant => variant.id === selectedSize)?.available })}
              {availability && availability === 1 && t('lastPiece')}
              {availability && availability > 2 && t('inStock')}
            </div>
            <p className="mb-1 text-lg text-black sm:text-xl">{product.name} </p>
            <p className="mb-1 text-sm text-gray-light sm:text-base">{product.description}</p>
            <p className="text-sm text-gray-light sm:text-base">{product.materials}</p>
            <div className="mt-5 flex h-9 w-full flex-row items-center justify-between sm:h-10">
              <div className="flex flex-row items-center justify-start gap-1 text-xs sm:text-base">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    className={`flex size-11 items-center justify-center rounded-full uppercase ${variant.id === selectedSize ? 'bg-black text-white' : 'bg-gray text-dark-gray'}`}
                    onClick={() => chooseSize(variant.id)}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
              {!wasAddedToCart ? (
                <button
                  className={`flex h-11 min-w-[150px] flex-row items-center justify-center gap-2 rounded-full px-3.5 text-base text-white ${isVariantInCart ? 'bg-dark-gray' : 'bg-black'}`}
                  onClick={() => handleAddToCart()}
                  disabled={isVariantInCart}
                >
                  <span className="text-white">{isVariantInCart ? t('alreadyInBag') : t('addToBag')}</span>
                  {!isVariantInCart && <p className="text-white">{priceToString(price, currencySymbol)}</p>}
                </button>
              ) : (
                <div className="flex h-11 min-w-[140px] flex-row items-center justify-between gap-2 rounded-full bg-light-green px-3.5 text-base text-white">
                  <p className="text-white">{t('added')}</p>
                  <p className="text-white">
                    {price}
                    {currencySymbol}
                  </p>
                </div>
              )}
            </div>
            <p className="mt-10 text-sm uppercase tracking-wide text-black sm:mt-14 sm:text-base">
              {t('fitsPerfectly')}
            </p>
            <p className="mt-2 text-sm text-gray-light sm:text-base">{t('sizeAdvice')}</p>
            <p className="mt-5 text-sm uppercase tracking-wide text-black sm:text-base">{t('worldwideDelivery')}</p>
            <p className="mt-2 text-sm text-gray-light sm:text-base">{t('deliveryDetails')}</p>
            <p className="mt-5 text-sm uppercase tracking-wide text-black sm:text-base">{t('freeReturns')}</p>
            <p className="mt-2 text-sm text-gray-light sm:text-base">{t('returnPolicy')}</p>
            <p className="mt-5 text-sm uppercase tracking-wide text-black sm:text-base">{t('easyToCare')}</p>
            <p className="mt-2 text-sm text-gray-light sm:text-base">{t('careInstructions')}</p>
            <Link
              href="/secret-store"
              className="mt-5 flex h-10 w-full flex-row items-center justify-between rounded-3xl bg-violet/10 px-3"
            >
              <span className="text-sm text-black">{t('newsletterDiscount')}</span>
              <span className="text-sm text-violet">{t('subscribe')}</span>
            </Link>
          </div>
        </div>
        <section className="mt-14 flex w-full flex-col items-center justify-center sm:mt-24 sm:max-w-[1440px]">
          <p className="mb-2 text-sm uppercase sm:mb-12 sm:text-base">{t('youMayAlsoLike')}</p>
          <ProductRecommendations productID={product.id} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

async function fetchProduct(handle: string, locale: string) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${handle}`, {
    headers: {
      'Accept-Language': locale,
    },
  });

  return await resp.json();
}

export const getStaticProps = async (ctx: any) => {
  return {
    props: {
      ...(await getI18nProps(ctx, ['product', 'common'])),
      product: await fetchProduct(ctx.params.handle, ctx.params.locale),
    },
  };
};

export const getStaticPaths = async () => {
  const getPaths = async () => {
    const locales = i18nextConfig.i18n.locales;
    const paths = [];

    for (const locale of locales) {
      const products = await fetchProducts(locale);
      const localePaths = products.map((product: Product) => ({
        params: { locale, handle: product.handle },
      }));
      paths.push(...localePaths);
    }

    return paths;
  };

  const paths = await getPaths();

  return {
    fallback: false,
    paths,
  };
};
