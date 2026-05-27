import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      localStorage.setItem('cart', JSON.stringify([...prev, { ...product, qty: 1, type: "matang" }]));
      return [...prev, { ...product, qty: 1, type: "matang" }];
    });
  };

  const changeProductType = (product) => {

  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    localStorage.setItem('cart', JSON.stringify(cart.filter(item => item.id !== id)));
  };

  const emptyCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);

    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty } : item
      )
    );
    localStorage.setItem('cart', JSON.stringify(cart.map(item =>
      item.id === id ? { ...item, qty } : item
    )));
  };

  const updateType = (id, type) => {

    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, type } : item
      )
    );
    localStorage.setItem('cart', JSON.stringify(cart.map(item =>
      item.id === id ? { ...item, type } : item
    )));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQty,
      emptyCart,
      updateType,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);