import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CheckoutPage.css';
import { useCart } from './CartContext';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCart();
  }, []);

  const totalSum = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert('Пожалуйста, выберите способ оплаты.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/cart/checkout/',
        { payment_method: paymentMethod }, // ← добавь, если нужно
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOrderPlaced(true);
      await fetchCart(); // обновляем корзину (будет пустая после заказа)
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      alert('Не удалось оформить заказ');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <h2>✅ Заказ успешно оформлен!</h2>
        <p>Спасибо за покупку.</p>
        <button className="btn btn-primary" onClick={handleGoBack}>
          ← Вернуться в каталог
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Link to="/">← В каталог</Link>
      <h2>Оформление заказа</h2>
      <div className="checkout-content">
        <div className="cart-summary">
          <h3>Ваш заказ:</h3>
          {loading ? (
            <p>Загружаем данные...</p>
          ) : cartItems.length === 0 ? (
            <p>Корзина пуста.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Кол-во</th>
                  <th>Цена</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product?.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.product?.price}₽</td>
                    <td>{item.quantity * item.product?.price}₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="total">
            <strong>Итого: {totalSum}₽</strong>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3>Способ оплаты:</h3>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />{' '}
              Банковская карта
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />{' '}
              Наличные
            </label>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading || cartItems.length === 0}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            {loading ? 'Оформляем...' : '✅ Подтвердить заказ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
