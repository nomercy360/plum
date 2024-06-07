import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocaleContext } from '@/context/locale-provider';

type CartItem = {
  product_id: number;
  quantity: number;
  variant_id: number;
  variant_name: string;
  price: number;
  product_name: string;
  image_url: string;
};

type CartDiscount = {
  code: string;
  is_active: boolean;
  type: string;
  usage_limit: number;
  usage_count: number;
  starts_at: string;
  ends_at: string;
  value: number;
};

type Cart = {
  count: number;
  items: Array<CartItem>;
  id: number;
  total: number;
  subtotal: number;
  discount?: CartDiscount;
  currency: string;
}

interface ICart {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  decreaseQuantity: (id: number) => void;
  increaseQuantity: (id: number) => void;
  applyDiscount: (code: string) => void;
  clearCart: () => void;
  getCartItems: () => Array<CartItem>;
}

async function fetchAPI({ endpoint, method = 'GET', body = null, locale = 'en' }: {
  endpoint: string,
  method?: string,
  body?: any,
  locale: string
}) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': locale,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`http://localhost:8080/api/${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}

export const CartContext = createContext<ICart>({
  cart: {} as Cart,
  addToCart: () => {
  },
  decreaseQuantity: () => {
  },
  increaseQuantity: () => {
  },
  applyDiscount: () => {
  },
  clearCart: () => {
  },
  getCartItems: () => [],
});

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    currentLanguage,
  } = useContext(LocaleContext);

  const [cart, setCart] = useState<Cart>({} as Cart);

  useEffect(() => {
    const cartID = localStorage.getItem('plum-cart-id');
    if (!cartID) {
      setCart({ count: 0 } as Cart);
      return;
    }

    fetchAPI({
        endpoint: `cart/${cartID}`,
        locale: currentLanguage,
      },
    ).then((cart) => {
      if (!cart.id) {
        localStorage.removeItem('plum-cart-id');
      } else {
        setCart(cart);
      }
    });

  }, [currentLanguage]);

  const addToCart = async (item: CartItem) => {
    if (!cart.id) {
      const newCart = await fetchAPI({ endpoint: 'cart', method: 'POST', body: item, locale: currentLanguage });
      if (newCart) {
        setCart(() => newCart);
        localStorage.setItem('plum-cart-id', String(newCart.id));
        return;
      }
    }

    const resp = await fetchAPI({ endpoint: `cart/${cart.id}/products`, method: 'POST', body: item });
    setCart(() => resp);
  };


  const decreaseQuantity = (id: number) => {

  };

  const clearCart = () => {

  };

  const increaseQuantity: (id: number) => void = (id: number) => {

  };

  const applyDiscount = async (code: string) => {
    if (code === '') {
      const resp = await fetchAPI({ endpoint: `cart/${cart.id}/discounts`, method: 'DELETE' });
      if (resp) {
        setCart(() => resp);
      }
    } else {
      const resp = await fetchAPI({ endpoint: `cart/${cart.id}/discounts`, method: 'POST', body: { code } });
      setCart(() => resp);
    }
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        applyDiscount,
        clearCart,
        getCartItems: () => cart.items,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
