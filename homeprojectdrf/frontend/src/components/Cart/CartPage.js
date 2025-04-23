import React, { useEffect } from "react";
import { useCart } from "./CartContext";
import axios from "axios";
import {Link} from "react-router-dom";

const CartPage = () => {
    const { cartItems, fetchCart } = useCart();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchCart();
    }, []);



   const updateQuantity = async (productId, newQuantity) => {
    try {
        if (newQuantity <= 0) {
            await deleteItem(productId);
            return;
        }

        await axios.patch(
            "http://127.0.0.1:8000/api/cart/update/",
            {
                product_id: productId,
                quantity: newQuantity,
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
        console.error("Ошибка при обновлении количества:", error);
    }
};

    const deleteItem = async (productId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/cart/${productId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCart();
        } catch (error) {
            console.error("Ошибка при удалении товара:", error);
        }
    };

    const placeOrder = async () => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/cart/order/",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("🎉 Заказ успешно оформлен!");
            fetchCart(); // Обновить корзину (должна быть пустой)
        } catch (error) {
            console.error("Ошибка при оформлении заказа:", error);
            alert("❌ Не удалось оформить заказ");
        }
    };

    const totalSum = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    if (!cartItems.length) {
        return <div className="container mt-5" style={{display:'grid'}}><Link to={'/'}>На главную</Link> Корзина пуста 🧺</div>;
    }

    return (
        <div className="container mt-5">
            <Link to={'/'}>На главную</Link>
            <h2>🛒 Ваша корзина</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Товар</th>
                        <th>Цена</th>
                        <th>Количество</th>
                        <th>Сумма</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.product.name}</td>
                            <td>{item.product.price} ₽</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    >
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() =>
                                            updateQuantity(item.product.id, item.quantity + 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td>{(item.quantity * item.product.price).toFixed(2)} ₽</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => deleteItem(item.product.id)}
                                >
                                    🗑️ Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center">
                <h4>Итого: <strong>{totalSum.toFixed(2)} ₽</strong></h4>
                <button
                    className="btn btn-success"
                    onClick={placeOrder}
                >
                    ✅ Оформить заказ
                </button>
            </div>
        </div>
    );
};

export default CartPage;
