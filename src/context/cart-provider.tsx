import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocaleContext } from '@/context/locale-provider';

export type CartItem = {
  id: number;
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

export type Cart = {
  count: number;
  items: Array<CartItem>;
  id: number;
  total: number;
  subtotal: number;
  discount?: CartDiscount;
  currency_code: string;
  currency_symbol: string;
  discount_amount: number;
  customer?: {
    email: string;
    id: number;
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    zip?: string;
    phone?: string;
  };
};

type AddToCartItem = {
  product_id: number;
  quantity: number;
  variant_id: number;
};

interface ICart {
  cart: Cart;
  addToCart: (item: AddToCartItem) => void;
  updateCartItem: (id: number, quantity: number) => void;
  applyDiscount: (code?: string) => Promise<void>;
  clearCart: () => void;
  getCartItems: () => Array<CartItem>;
  restoreCart: () => void;
  saveCartCustomer: (email: string) => void;
}

async function fetchAPI({
  endpoint,
  method = 'GET',
  body = null,
  locale = 'en',
}: {
  endpoint: string;
  method?: string;
  body?: any;
  locale?: string;
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

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, options);
}

export const CartContext = createContext<ICart>({
  cart: {} as Cart,
  addToCart: () => {},
  updateCartItem: () => {},
  applyDiscount: async () => {},
  clearCart: () => {},
  getCartItems: () => [],
  restoreCart: () => {},
  saveCartCustomer: () => {},
});

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentLanguage } = useContext(LocaleContext);

  const [cart, setCart] = useState<Cart>({} as Cart);

  useEffect(() => {
    const cartID = localStorage.getItem('plum-cart-id');
    if (!cartID) {
      setCart({ count: 0 } as Cart);
      return;
    }

    const cartResp = fetchAPI({
      endpoint: `cart/${cartID}`,
      locale: currentLanguage,
    })
      .then(resp => {
        if (resp.status === 404) {
          return null;
        }
        return resp.json();
      })
      .then(data => {
        if (data) {
          setCart(() => data);
        } else {
          localStorage.removeItem('plum-cart-id');
        }
      });
  }, [currentLanguage]);

  const addToCart = async (item: AddToCartItem) => {
    if (!cart.id) {
      const resp = await fetchAPI({ endpoint: 'cart', method: 'POST', body: item, locale: currentLanguage });
      const data = await resp.json();

      if (resp.ok && data.id) {
        setCart(() => data);
        localStorage.setItem('plum-cart-id', String(data.id));
        return;
      }
    }

    const resp = await fetchAPI({
      endpoint: `cart/${cart.id}/items`,
      method: 'POST',
      body: item,
      locale: currentLanguage,
    });

    const data = await resp.json();
    if (resp.ok) {
      setCart(() => data);
    }
  };

  const updateCartItem = async (id: number, quantity: number) => {
    let cartResp;
    if (quantity === 0) {
      cartResp = await fetchAPI({ endpoint: `cart/${cart.id}/items/${id}`, method: 'DELETE', locale: currentLanguage });
    } else if (quantity < 0) {
      return;
    } else {
      cartResp = await fetchAPI({
        endpoint: `cart/${cart.id}/items/${id}`,
        method: 'PUT',
        body: { quantity },
        locale: currentLanguage,
      });
    }

    if (cartResp.ok) {
      const data = await cartResp.json();
      setCart(() => data);
    }
  };

  const clearCart = () => {
    localStorage.setItem('plum-restore-cart-id', String(cart.id));
    localStorage.removeItem('plum-cart-id');
    setCart({ count: 0 } as Cart);
  };

  const restoreCart = async () => {
    const cartID = localStorage.getItem('plum-restore-cart-id');
    if (!cartID) {
      return;
    }

    const cartResp = await fetchAPI({ endpoint: `cart/${cartID}`, locale: currentLanguage });
    if (cartResp.ok) {
      const data = await cartResp.json();
      setCart(() => data);
      localStorage.setItem('plum-cart-id', String(data.id));
    }

    localStorage.removeItem('plum-restore-cart-id');
  };

  const applyDiscount = async (code?: string) => {
    if (code == undefined) {
      const resp = await fetchAPI({ endpoint: `cart/${cart.id}/discounts`, method: 'DELETE', locale: currentLanguage });
      const data = await resp.json();

      if (resp.ok) {
        setCart(() => data);
      }
    } else {
      const resp = await fetchAPI({
        endpoint: `cart/${cart.id}/discounts`,
        method: 'POST',
        body: { code },
        locale: currentLanguage,
      });
      const data = await resp.json();

      if (resp.ok && data.discount) {
        setCart(() => data);
      } else {
        throw new Error('Invalid discount code');
      }
    }
  };

  const saveCartCustomer = async (email: string) => {
    const resp = await fetchAPI({
      endpoint: `cart/${cart.id}/customer`,
      method: 'POST',
      body: { email },
      locale: currentLanguage,
    });
    const data = await resp.json();

    if (resp.ok) {
      setCart(() => data);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItem,
        applyDiscount,
        clearCart,
        restoreCart,
        getCartItems: () => cart.items,
        saveCartCustomer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
