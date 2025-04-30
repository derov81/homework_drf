import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './CheckoutPage.css';
import {useCart} from './CartContext';


const CheckoutPage = () => {
    const navigate = useNavigate();
    const {cartItems, fetchCart} = useCart();

    useEffect(() => {
        fetchCart();
    }, []);

    const totalSum = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    const thStyle = {
        textAlign: 'left',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #ddd'
    };

    const tdStyle = {
        padding: '10px',
        verticalAlign: 'middle'
    };

    return (
        <div className="checkout-container">
            <Link to={'/'}>В каталог</Link>
            <h2>Оформление заказа</h2>
            <div className="checkout-content">
                <div className="cart-summary">
                    <h3>Ваш заказ:</h3>
                    {cartItems.length === 0 ? (
                        <p>Корзина пуста.</p>
                    ) : (
                        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px'}}>
                            <thead>
                            <tr>
                                <th style={thStyle}>Товар</th>
                                <th style={thStyle}>Кол-во</th>
                                <th style={thStyle}>Цена за шт.</th>
                                <th style={thStyle}>Сумма</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={index} style={{borderBottom: '1px solid #ddd'}}>
                                    <td style={tdStyle}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                            {item.product?.image && (
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product?.brand_tool || item.product?.name || 'Товар'}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            )}
                                            <span>{item.product?.brand_tool || item.product?.name || 'Без названия'}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{item.quantity}</td>
                                    <td style={tdStyle}>{item.product?.price}₽</td>
                                    <td style={tdStyle}>{item.quantity * item.product?.price}₽</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                    <div className="total">
                        <strong>Итого: {totalSum}₽</strong>
                    </div>
                    <div style={{marginTop: '30px'}}>
                        <h3>Способ оплаты:</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
                            <label>
                                <input type="radio" name="paymentMethod" value="card" defaultChecked/> Банковская карта
                            </label>
                            <label>
                                <input type="radio" name="paymentMethod" value="cash"/> Наличные
                            </label>
                        </div>

                        <button
                            onClick={() => alert("Оплата пока только в тестовом режиме 😅")}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            Приступить к оплате
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
