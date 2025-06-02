import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthService from "../services/authService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    const user = AuthService.getCurrentUser();

    if (!token || !user) {
      setCartItems([]);
      setTotalQuantity(0);
      return;
    }

    try {
      setLoadingCart(true);
      const response = await axios.get("http://127.0.0.1:8000/api/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (!Array.isArray(data.items)) {
        console.error("Ошибка: поле 'items' не массив:", data);
        return;
      }

      setCartItems(data.items);

      const total = data.items.reduce((sum, item) => sum + item.quantity, 0);
      setTotalQuantity(total);
    } catch (error) {
      console.error("Ошибка при загрузке корзины:", error);
      setCartItems([]);
      setTotalQuantity(0);
    } finally {
      setLoadingCart(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Нет токена, пользователь не авторизован");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/",
        {
          product_id: productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchCart();
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalQuantity(0);
  };

  // Загрузка корзины только при инициализации, если пользователь авторизован
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    const token = localStorage.getItem("token");

    if (user && token) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        fetchCart,
        addToCart,
        clearCart,
        setCartItems,
        loadingCart,
        setTotalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
