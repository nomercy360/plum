import React, { createContext, useEffect, useState } from 'react';

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


async function fetchDiscount(cartID: number, promoCode: string) {
  const response = await fetch(`http://localhost:8080/api/cart/${cartID}/discounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: promoCode }),
  });

  if (response.status === 200) {
    return response.json();
  } else {
    throw new Error('Error applying discount');
  }
}

async function fetchDeleteDiscount(cartID: number) {
  const response = await fetch(`http://localhost:8080/api/cart/${cartID}/discounts`, {
    method: 'DELETE',
  });

  if (response.status === 200) {
    return response.json();
  } else {
    throw new Error('Error deleting discount');
  }
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

async function fetchCart(id: number) {
  const response = await fetch(`http://localhost:8080/api/cart/${id}`);

  switch (response.status) {
    case 404:
      return [];
    case 200:
      break;
    default:
      throw new Error('Error fetching cart');
  }

  return response.json();
}

async function fetchAddToCart(id: number, item: CartItem) {
  const response = await fetch(`http://localhost:8080/api/cart/${id}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  switch (response.status) {
    case 200:
      return response.json();
    default:
      throw new Error('Error appending to cart');
  }
}

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart>({} as Cart);

  useEffect(() => {
    const cartID = localStorage.getItem('plum-cart-id');
    if (!cartID) {
      setCart({ count: 0, items: [], id: 0, total: 0, subtotal: 0, discount: {} as CartDiscount, currency: 'USD' });
    }

    fetchCart(Number(cartID)).then((cart) => {
      setCart(cart);
    });

  }, []);

  const addToCart = async (item: CartItem) => {
    const resp = await fetchAddToCart(cart.id, item);
    if (resp) {
      setCart(() => resp);
    }
  };

  const decreaseQuantity = (id: number) => {

  };

  const clearCart = () => {

  };

  const increaseQuantity: (id: number) => void = (id: number) => {

  };

  const applyDiscount = async (code: string) => {
    if (code === '') {
      const resp = await fetchDeleteDiscount(cart.id);
      if (resp) {
        setCart(() => resp);
      }
    } else {
      const resp = await fetchDiscount(cart.id, code);
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
