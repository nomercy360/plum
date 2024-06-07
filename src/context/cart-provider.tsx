import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocaleContext } from '@/context/locale-provider';

type CartItem = {
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

type Cart = {
  count: number;
  items: Array<CartItem>;
  id: number;
  total: number;
  subtotal: number;
  discount?: CartDiscount;
  currency: string;
}

type AddToCartItem = {
  product_id: number;
  quantity: number;
  variant_id: number;
};

interface ICart {
  cart: Cart;
  addToCart: (item: AddToCartItem) => void;
  updateCartItem: (id: number, quantity: number) => void;
  applyDiscount: (code: string) => void;
  clearCart: () => void;
  getCartItems: () => Array<CartItem>;
}

async function fetchAPI({ endpoint, method = 'GET', body = null, locale = 'en' }: {
  endpoint: string,
  method?: string,
  body?: any,
  locale?: string
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, options);

  if (!response.ok && response.status !== 404) {
    throw new Error('Network response was not ok');
  } else if (response.status === 404) {
    return null;
  }

  return response.json();
}

export const CartContext = createContext<ICart>({
  cart: {} as Cart,
  addToCart: () => {
  },
  updateCartItem: () => {
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
      if (!cart) {
        localStorage.removeItem('plum-cart-id');
      } else {
        setCart(cart);
      }
    });

  }, [currentLanguage]);

  const addToCart = async (item: AddToCartItem) => {
    if (!cart.id) {
      const newCart = await fetchAPI({ endpoint: 'cart', method: 'POST', body: item, locale: currentLanguage });
      if (newCart) {
        setCart(() => newCart);
        localStorage.setItem('plum-cart-id', String(newCart.id));
        return;
      }
    }

    const resp = await fetchAPI({ endpoint: `cart/${cart.id}/items`, method: 'POST', body: item });
    setCart(() => resp);
  };


  const updateCartItem = async (id: number, quantity: number) => {
    if (quantity === 0) {
      return;
    }

    const resp = await fetchAPI({ endpoint: `cart/${cart.id}/items/${id}`, method: 'PUT', body: { quantity } });
    if (resp) {
      setCart(() => resp);
    }
  };

  const clearCart = () => {

  };

  const applyDiscount = async (code: string) => {
    if (code === '') {
      const resp = await fetchAPI({ endpoint: `cart/${cart.id}/discounts`, method: 'DELETE' });
      if (resp) {
        setCart(() => resp);
      }
    } else {
      const resp = await fetchAPI({ endpoint: `cart/${cart.id}/discounts`, method: 'POST', body: { code } });
      if (resp) {
        setCart(() => resp);
      }
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
        getCartItems: () => cart.items,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
