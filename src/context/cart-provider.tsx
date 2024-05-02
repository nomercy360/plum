import React, { createContext, useEffect, useState } from 'react';

type ICartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
};

interface ICart {
  cart: Array<ICartItem>;
  addToCart: (item: ICartItem) => void;
  decreaseQuantity: (id: number) => void;
  increaseQuantity: (id: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItems: () => Array<ICartItem>;
}

const writeCartToLocalStorage = (cart: Array<ICartItem>) => {
  localStorage.setItem('plum-cart-state', JSON.stringify(cart));
};

export const CartContext = createContext<ICart>({
  cart: [],
  addToCart: () => {
  },
  decreaseQuantity: () => {
  },
  increaseQuantity: () => {
  },
  clearCart: () => {
  },
  getCartTotal: () => 0,
  getCartItems: () => [],
});

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Array<ICartItem>>([]);

  useEffect(() => {
    const storageValue = localStorage.getItem('plum-cart-state');
    if (storageValue) {
      setCart(JSON.parse(storageValue));
    }
  }, []);

  const addToCart = (item: ICartItem) => {
    const existingItem = cart.find((i) => i.id === item.id);
    if (existingItem) {
      setCart(() => {
        const newCart = cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
        writeCartToLocalStorage(newCart);
        return newCart;
      });
    } else {
      setCart(() => {
        writeCartToLocalStorage([...cart, item]);
        return [...cart, item];
      });
    }

    // localStorage.setItem('plum-cart-state', JSON.stringify(cart))
  };

  const decreaseQuantity = (id: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (item.quantity > 1) {
      setCart(() => {
        const newCart = cart.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
        );
        writeCartToLocalStorage(newCart);
        return newCart;
      });
    } else {
      setCart(() => {
        const newCart = cart.filter((i) => i.id !== id);
        writeCartToLocalStorage(newCart);
        return newCart;
      });
    }
  };

  const clearCart = () => {
    setCart(() => {
      localStorage.removeItem('plum-cart-state');
      return [];
    });
  };

  const increaseQuantity: (id: number) => void = (id: number) => {
    setCart(() => {
        const newCart = cart.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
        );
        writeCartToLocalStorage(newCart);
        return newCart;
      },
    );
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getCartTotal: () => cart.reduce((acc, item) => acc + item.quantity, 0),
        getCartItems: () => cart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;