import { useCart } from "./CartContext";

export default function CartPage() {
    const { cart, clearCart } = useCart();

    const handleCheckout = () => {
        alert("Оформление заказа!");
        clearCart();
    };

    return (
        <div className="container mt-4">
            <h3>Корзина</h3>
            {cart.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <>
                    <ul className="list-group mb-3">
                        {cart.map((item, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between">
                                <span>{item.name}</span>
                                <span>{item.price} ₽</span>
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-primary" onClick={handleCheckout}>Оформить заказ</button>
                </>
            )}
        </div>
    );
}
