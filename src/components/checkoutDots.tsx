import { CartItem } from '@/context/cart-provider';
import { useEffect, useState } from 'react';

export const CheckoutDots = (item: { item: CartItem }) => {
  const [widthClient, setWidthClient] = useState(0);
  const { product_name, quantity } = item.item;
  const [isDescOpen, setIsDescOpen] = useState(false);
  useEffect(() => {
    const width = document.querySelector('#refId')?.clientWidth;
    if (width) {
      setWidthClient(width);
    }
  }, []);

  return (
    <div
      className={`relative flex flex-row gap-[5px] overflow-hidden ${isDescOpen ? '' : 'max-h-[19px] lg:max-h-[21px]'}`}
      id="refId"
    >
      <p className="text-sm leading-[21px] sm:text-base">
        {product_name} {quantity > 1 && `x ${quantity}`}
      </p>

      {!isDescOpen &&
        // @ts-ignore
        widthClient > 0 &&
        widthClient < 250 &&
        product_name.length > 28 && (
          <button
            onClick={() => setIsDescOpen(prev => !prev)}
            className="absolute bottom-0 right-0 mx-[5px] bg-[linear-gradient(90.00deg,rgba(254,254,254,0),rgb(255,255,255)_54.444%)] text-center leading-[21px]"
          >
            ...
          </button>
        )}
    </div>
  );
};
