import React, {useEffect} from "react";
import {useCart} from "./CartContext";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const CartPage = ({setShowCart}) => {
    const {cartItems, fetchCart, loadingCart} = useCart();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleCheckout = () => {
        setShowCart(false);
        navigate("/checkout", {state: {cart: cartItems}});
    };

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
            fetchCart(); // обновляем
        } catch (error) {
            console.error("Ошибка при удалении товара:", error);
        }
    };

    const totalSum = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.product.price,
        0
    );

     if (!cartItems.length && !loadingCart) {
        return (
            <div className="container mt-5">
                <button className=" btn-secondary mb-3" onClick={() => setShowCart(false)}>
                    ← Назад к товарам
                </button>
                <br/>
                Корзина пуста 🧺
            </div>
        );
     }

    return (
        <div className="container mt-5">
            <button className=" btn-secondary mb-3" onClick={() => setShowCart(false)}>
                ← Назад к товарам
            </button>

            <h2>🛒 Ваша корзина</h2>

            {/*{loadingCart && <div className="text-muted mb-2">🔄 Обновление корзины...</div>}*/}

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
                                    onClick={() =>
                                        updateQuantity(item.product.id, item.quantity - 1)
                                    }
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
                <h4>
                    Итого: <strong>{totalSum.toFixed(2)} ₽</strong>
                </h4>
                <button
                    type="button"  // 👈 добавь обязательно
                    className="btn btn-success"
                    onClick={handleCheckout}
                >
                    ✅ Оформить заказ
                </button>
            </div>
        </div>
    );
};

export default CartPage;
