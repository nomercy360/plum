import { Suspense, useContext } from 'react';
import Link from '@/components/Link';
import ExportedImage from 'next-image-export-optimizer';
import { LocaleContext } from '@/context/locale-provider';
import languageDetector from '@/lib/languageDetector';
import i18nextConfig from '../../next-i18next.config';

export default function ProductRecommendations(props: { products: any[] }) {
  const {
    currency, currencySign, currentLanguage,
  } = useContext(LocaleContext);

  const getProductPrice = (item: any) => {
    const price = item.prices.find((price: any) => price.currency === currency);
    return price ? price.amount : item.prices[0].amount;
  };

  return (
    <Suspense fallback={<LoaderSkeleton />}>
      <div
        className="flex w-screen flex-row gap-3 overflow-x-auto p-5 sm:grid sm:w-full sm:grid-cols-4 sm:gap-10 sm:overflow-x-hidden sm:p-14">
        {props.products.map((product) => (
            <Link
              key={product.id}
              className="flex min-w-[170px] flex-col items-start justify-start"
              href={`/products/${product.handle}`}>
              <ExportedImage
                alt=""
                className="w-full rounded-lg object-cover aspect-[5/7]"
                src={product.image}
                width={370}
                height={520}
              />
              <p className="mb-1 mt-2.5 text-sm sm:mt-4 sm:text-base">
                {product.name[currentLanguage]}
              </p>
              <p className="text-xs text-gray-light sm:text-base">
                {getProductPrice(product)}{currencySign}
              </p>
            </Link>
          ),
        )}
      </div>
    </Suspense>
  );
}

const LoaderSkeleton = () => (
  <div
    className="flex w-screen flex-row gap-10 overflow-x-auto p-5 sm:grid sm:w-full sm:grid-cols-4 sm:overflow-x-hidden sm:p-14">
    {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex min-w-[170px] flex-col items-start justify-start">
          <div className="h-[420px] w-full animate-pulse rounded-lg bg-gray" />
        </div>
      ),
    )}
  </div>
);
