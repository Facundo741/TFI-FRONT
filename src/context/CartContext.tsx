import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  id_producto: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

interface CartContextType {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const clearCart = () => {
    setCartCount(0);
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, cartItems, setCartItems, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};
