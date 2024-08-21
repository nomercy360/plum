import { useTranslation } from 'next-i18next';

import { getI18nProps, getStaticPaths } from '@/lib/getStatic';
import Footer from '@/components/Footer';
import Link from '@/components/Link';

import ExportedImage from 'next-image-export-optimizer';
import SubscribeForm from '@/components/SubscribeForm';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import { useContext, useMemo } from 'react';
import { CartContext } from '@/context/cart-provider';

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
  }[];
  image: string;
  images: string[];
  // currency_code: string;
  // currency_symbol: string;
  // price: number;
  prices: {
    currency_code: string;
    currency_symbol: string;
    price: number;
  }[];
};

export default function Home({ products }: { products: Product[] }) {
  const { t } = useTranslation(['common']);
  console.log(products);

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
  const productsSixthSection = products.slice(14, 18);
  // next 4
  const productsSeventhSection = products.slice(18, 22);
  // next 1
  const productsEighthSection = products[22];
  // next 4
  const productsNinthSection = products.slice(23, 27);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between bg-white pb-24 sm:pb-44">
        <Navbar />
        <div className="flex min-h-[520px] w-full px-5 lg:max-h-[600px] lg:px-12">
          <div className="flex w-full justify-center overflow-hidden rounded-2xl lg:rounded-xl">
            <video className="h-full w-full object-cover" src="/video/plum_ad_two_1160.mp4" autoPlay loop muted />
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
          <div className="grid grid-cols-2 gap-10">
            {productsSeventhSection.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <ProductCard product={productsEighthSection} />
          <div className="col-span-2 grid grid-cols-4 gap-10">
            {productsNinthSection.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        <div className="mb-10 mt-4 grid grid-cols-2 gap-4 px-5 lg:hidden">
          {products.map(product =>
            // every fifth product
            product.id % 5 <= 3 ? (
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

  const price = useMemo(() => product.prices.find(price => price.currency_code === currency), [currency]);

  const priceString = price
    ? price.currency_symbol === '$'
      ? `$${price.price}`
      : `${price.price} ${price.currency_symbol}`
    : '';

  return (
    <>
      <Head>
        <meta name="og:title" content="PLUM®" />
        <meta name="og:description" content="Dresses & things" />
        <meta name="og:image" content="https://plumplum.co/images/og.png" />
        <meta name="description" content="Dresses & things" />
      </Head>
      <Link key={product.id} className="flex flex-col items-start justify-start" href={`/products/${product.handle}`}>
        <ExportedImage
          alt=""
          className="aspect-[5/7] w-full rounded-lg object-cover sm:size-full"
          src={product.image}
          width={700}
          height={1200}
        />
        <div>
          <p className="mb-1 mt-2 text-sm sm:mt-3 sm:text-base">{product.name}</p>
          <p className="text-xs text-gray-light sm:text-base">{priceString}</p>
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
