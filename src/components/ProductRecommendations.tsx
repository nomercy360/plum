import { Suspense } from 'react';
import Link from '@/components/Link';

export default function ProductRecommendations(props: { products: any[] }) {

  return (
    <Suspense fallback={<LoaderSkeleton />}>
      <div
        className="flex w-screen flex-row gap-3 overflow-x-auto p-5 sm:grid sm:w-full sm:grid-cols-4 sm:gap-10 sm:overflow-x-hidden sm:p-14">
        {props.products.map((product) => (
            <Link
              key={product.id}
              className="flex min-w-[170px] flex-col items-start justify-start"
              href={`/products/${product.handle}`}>
              <img
                alt=""
                className="w-full rounded-lg object-cover"
                src={product.image}
              />
              <p className="mb-1 mt-2.5 text-sm sm:mt-4 sm:text-base">
                {product.name}
              </p>
              <p className="text-xs text-gray-light sm:text-base">
                ${product.price}
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
