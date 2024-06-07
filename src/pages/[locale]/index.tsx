import { useTranslation } from 'next-i18next';

import { getI18nProps, getStaticPaths } from '@/lib/getStatic';
import Footer from '@/components/Footer';
import { NavbarHome } from '@/components/Navbar';
import Link from '@/components/Link';

import ExportedImage from 'next-image-export-optimizer';
import SubscribeForm from '@/components/SubscribeForm';
import { useContext } from 'react';
import { LocaleContext } from '@/context/locale-provider';

export type Product = {
  id: number;
  handle: string;
  name: string;
  description: string;
  variants: {
    id: number;
    name: string;
    quantity: number;
  }[];
  image: string;
  images: string[];
  currency: string;
  price: number;
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

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between bg-white p-2 pb-24 sm:pb-44">
        <div
          className="sm:aspect-auto aspect-square sm:h-[560px] w-full rounded-lg bg-[url(/images/hero-mobile.webp)] bg-cover bg-center sm:bg-[url(/images/hero.webp)]">
          <NavbarHome />
        </div>
        <div
          className="lg:grid hidden grid-cols-2 mb-20 mt-16 gap-10 px-10">
          <div className="grid grid-cols-2 gap-10">
            {productsFirstSection.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <ProductCard product={productsSecondSection} />
          <div className="col-span-2 grid grid-cols-4 gap-10">
            {productsThirdSection.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <ProductCard product={productsFourthSection} />
          <div className="grid grid-cols-2 gap-10">
            {productsFifthSection.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
        <div className="grid lg:hidden mb-10 mt-4 grid-cols-2 gap-4">
          {products.map((product) => (
            // every fifth product
            product.id % 5 === 0 ?
              <div key={product.id} className="col-span-2 row-span-2">
                <ProductCard product={product} />
              </div> :
              <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <SubscribeForm style="light" />
      </main>
      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const {
    currencySign,
  } = useContext(LocaleContext);

  return (
    <Link
      key={product.id}
      className="flex flex-col items-start justify-start"
      href={`/products/${product.handle}`}>
      <ExportedImage
        alt=""
        className="size-full rounded-lg object-cover aspect-[5/7]"
        src={product.image}
        width={370}
        height={520}
      />
      <div className="min-h-16">
        <p className="mb-1 text-sm sm:mt-4 mt-2 sm:text-base">
          {product.name}
        </p>
        <p className="text-xs text-gray-light sm:text-base">
          {product.price}{currencySign}
        </p>
      </div>
    </Link>
  );
}

export async function fetchProducts(locale: string) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`,
    {
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
      ...(await getI18nProps(ctx, [
        'common',
      ])),
      products: await fetchProducts(ctx.params.locale),
    },
  };
};
