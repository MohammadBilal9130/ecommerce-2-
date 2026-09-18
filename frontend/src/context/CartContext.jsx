import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem('gangster_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart items', e);
        localStorage.removeItem('gangster_cart');
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('gangster_cart', JSON.stringify(updatedCart));
  };

  const addToCart = (product, size, color, quantity = 1) => {
    const selectedSize = size || product.sizes[0] || 'M';
    const selectedColor = color || product.colors[0] || 'Black';
    const cartItemId = `${product._id}-${selectedSize}-${selectedColor}`;

    const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId);

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      const newItem = {
        cartItemId,
        product: product._id,
        title: product.title,
        slug: product.slug,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
        mrp: product.mrp,
        image: product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
        quantity
      };
      updatedCart = [...cart, newItem];
    }

    saveCartToStorage(updatedCart);
    toast?.success(`Added "${product.title}" (${selectedSize}) to Bag!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    const itemToRemove = cart.find((item) => item.cartItemId === cartItemId);
    const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
    saveCartToStorage(updatedCart);
    if (itemToRemove) {
      toast?.info(`Removed "${itemToRemove.title}"`);
    }
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const updatedCart = cart.map((item) => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: newQty };
      }
      return item;
    });

    saveCartToStorage(updatedCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartMrpTotal = cart.reduce((total, item) => total + (item.mrp || item.price) * item.quantity, 0);
  const cartSavings = cartMrpTotal > cartSubtotal ? cartMrpTotal - cartSubtotal : 0;
  const isFreeShipping = cartSubtotal >= 999;
  const shippingFee = cartSubtotal === 0 ? 0 : isFreeShipping ? 0 : 49;
  const cartGrandTotal = cartSubtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartMrpTotal,
        cartSavings,
        isFreeShipping,
        shippingFee,
        cartGrandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
