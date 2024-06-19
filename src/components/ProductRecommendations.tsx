import { Suspense, useContext, useEffect, useState } from 'react';
import Link from '@/components/Link';
import ExportedImage from 'next-image-export-optimizer';
import { LocaleContext } from '@/context/locale-provider';
import { Product } from '@/pages/[locale]';

export default function ProductRecommendations(props: { productID: number }) {
  const { currencySign } = useContext(LocaleContext);

  const [products, setProducts] = useState<Product[]>([]);

  const fetchRelatedProducts = async () => {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    return await resp.json().then(data => data.filter((p: Product) => p.id !== props.productID).slice(0, 4));
  };

  useEffect(() => {
    fetchRelatedProducts().then(data => setProducts(data));
  }, []);

  return (
    <Suspense fallback={<LoaderSkeleton />}>
      <div className="flex w-screen flex-row gap-3 overflow-x-auto p-5 sm:grid sm:w-full sm:grid-cols-4 sm:gap-10 sm:overflow-x-hidden sm:p-14">
        {products.map(product => (
          <Link
            key={product.id}
            className="flex min-w-[170px] flex-col items-start justify-start"
            href={`/products/${product.handle}`}
          >
            <ExportedImage
              alt=""
              className="aspect-[5/7] w-full rounded-lg object-cover"
              src={product.image}
              width={370}
              height={520}
            />
            <p className="mb-1 mt-2.5 text-sm sm:mt-4 sm:text-base">{product.name}</p>
            <p className="text-xs text-gray-light sm:text-base">
              {product.price}
              {currencySign}
            </p>
          </Link>
        ))}
      </div>
    </Suspense>
  );
}

const LoaderSkeleton = () => (
  <div className="flex w-screen flex-row gap-10 overflow-x-auto p-5 sm:grid sm:w-full sm:grid-cols-4 sm:overflow-x-hidden sm:p-14">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="flex min-w-[170px] flex-col items-start justify-start">
        <div className="h-[420px] w-full animate-pulse rounded-lg bg-gray" />
      </div>
    ))}
  </div>
);
