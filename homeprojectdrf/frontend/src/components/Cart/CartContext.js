import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
  try {
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
  }
};

  const addToCart = async (productId, quantity = 1) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post("http://127.0.0.1:8000/api/cart/", {
      product_id: productId,
      quantity,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    fetchCart(); // обновить корзину после добавления
  } catch (error) {
    console.error("Ошибка при добавлении в корзину:", error);
  }
};

  return (
    <CartContext.Provider value={{ cartItems, totalQuantity, fetchCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);