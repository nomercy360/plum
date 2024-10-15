import { useTranslation } from 'next-i18next';

import { getI18nProps, getStaticPaths } from '@/lib/getStatic';
import Footer from '@/components/Footer';
import Link from '@/components/Link';

import SubscribeForm from '@/components/SubscribeForm';
import Navbar from '@/components/Navbar';
import { useContext, useMemo } from 'react';
import { CartContext } from '@/context/cart-provider';
import Image from 'next/image';

export type Product = {
  id: number;
  handle: string;
  name: string;
  materials: string;
  description: string;
  variants: {
    id: number;
    name: string;
    available: number;
    prices: {
      currency_code: string;
      currency_symbol: string;
      price: number;
      sale_price?: number;
    }[];
  }[];
  image: string;
  images: string[];
  prices: {
    currency_code: string;
    currency_symbol: string;
    price: number;
  }[];
};

export default function Home({ products }: { products: Product[] }) {
  const { t } = useTranslation(['common']);

  //first 4
  const productsFirstSection = products.slice(0, 4);
  // fifth
  const productsSecondSection = products[4];
  // next 4
  const productsThirdSection = products.slice(5, 9);
  // next 1
  const productsFourthSection = products[9];
  // next 4
  const productsFifthSection = products.slice(10, 14);
  // next 4
  const productsSixthSection = products.slice(14, 21);
  // next 4
  // const productsSeventhSection = products.slice(18, 21);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between bg-white pb-24 sm:pb-44">
        <Navbar />
        <div className="flex min-h-[520px] w-full px-5 lg:max-h-[600px] lg:px-12">
          <div className="flex w-full justify-center overflow-hidden rounded-2xl lg:rounded-xl">
            <Image
              src="/images/hero.jpg"
              alt="Hero"
              width={1920}
              height={1080}
              className="object-cover w-full rounded-2xl lg:rounded-xl border"
              sizes="(max-width: 600px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="mb-20 mt-10 hidden grid-cols-2 gap-10 px-12 lg:grid">
          <div className="grid grid-cols-2 gap-10">
            {productsFirstSection.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <ProductCard product={productsSecondSection} />
          <div className="col-span-2 grid grid-cols-4 gap-10">
            {productsThirdSection.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <ProductCard product={productsFourthSection} />
          <div className="grid grid-cols-2 gap-10">
            {productsFifthSection.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="col-span-2 grid grid-cols-4 gap-10">
            {productsSixthSection.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        <div className="mb-10 mt-4 grid grid-cols-2 gap-4 px-5 lg:hidden">
          {products.map((product, index) =>
            // every fifth product
            index % 5 <= 3 ? (
              <ProductCard key={product.id} product={product} />
            ) : (
              <div key={product.id} className="col-span-2 row-span-2">
                <ProductCard product={product} />
              </div>
            ),
          )}
        </div>
        <SubscribeForm style="light" />
      </main>
      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { currency } = useContext(CartContext);

  const price = useMemo(
    () => product.variants[0].prices.find(price => price.currency_code === currency),
    [product, currency],
  );

  const priceToString = (price: number, currencySymbol: string) => {
    return currencySymbol === '$' ? `$${price}` : `${price} ${currencySymbol}`;
  };

  const salePrice = price?.sale_price;

  return (
    <>
      <Link key={product.id} className="flex flex-col items-start justify-start" href={`/products/${product.handle}`}>
        <Image
          src={product.image}
          alt={product.name}
          width={400}  // Set explicit width
          height={400} // Set explicit height
          blurDataURL={product.image}
          placeholder="blur"
          className="aspect-[5/7] w-full rounded-lg object-cover sm:size-full"
          sizes="(max-width: 600px) 100vw, 50vw" // Provide responsive sizes
        />
        <div>
          <p className="mb-1 mt-2 text-sm sm:mt-3 sm:text-base">{product.name}</p>
          <p className="text-xs text-gray-light sm:text-base">
            {salePrice ? (
              <>
                {priceToString(salePrice, price!.currency_symbol)}{' '}
                <span
                  className="text-xs sm:text-base line-through">{priceToString(price!.price, price!.currency_symbol)}</span>
              </>
            ) : (
              priceToString(price!.price, price!.currency_symbol)
            )}
          </p>
        </div>
      </Link>
    </>
  );
}

export async function fetchProducts(locale: string) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    headers: {
      'Accept-Language': locale,
    },
  });
  return await resp.json();
}

export { getStaticPaths };
export const getStaticProps = async (ctx: any) => {
  return {
    props: {
      ...(await getI18nProps(ctx, ['common'])),
      products: await fetchProducts(ctx.params.locale),
    },
  };
};
