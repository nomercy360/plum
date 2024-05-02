import { useTranslation } from 'next-i18next';

import { getI18nProps, getStaticPaths } from '@/lib/getStatic';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Link from '@/components/Link';

import { products } from '@/lib/api';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  handle: string;
  sizes: string[];
  images: string[];
  description: string;
}

export default function Home({ products }: { products: Product[] }) {
  const { t } = useTranslation(['common']);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between bg-white p-2 pb-24 sm:pb-44">
        <div
          className="h-[600px] w-full rounded-lg bg-[url(/images/hero-mobile.webp)] bg-cover bg-center sm:bg-[url(/images/hero.webp)]">
          <Navbar theme={'dark'} />
        </div>
        <div
          className="mb-10 mt-4 grid grid-cols-2 gap-4 px-2 sm:mb-20 sm:mt-16 sm:grid-cols-4 sm:gap-10 sm:px-10">
          {products.map((product) =>
            <Link
              key={product.id}
              className="flex flex-col items-start justify-start"
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
            </Link>,
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


export { getStaticPaths };
export const getStaticProps = async (ctx: any) => {
  return {
    props: {
      ...(await getI18nProps(ctx, [
        'common',
      ])),
      products,
    },
  };
};