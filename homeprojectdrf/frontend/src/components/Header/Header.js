import React, {useEffect} from 'react';
import {useCart} from '../Cart/CartContext';
import {Link} from "react-router-dom";

const Header = ({user, onLogout, onLoginClick, setTab, setShowCart}) => {
    const {totalQuantity, fetchCart} = useCart();

    useEffect(() => {
        fetchCart(); // при монтировании обновим корзину
    }, []);

    return (
        <header style={{
            backgroundColor: '#1e3a8a',
            color: '#FFF',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <div className="logo">SHOP TOOLS</div>
            <div style={{marginInline: '30px'}}>info@shoptools.by</div>
            <div>+375 (17) 555-55-55</div>

            <div style={{position: 'relative'}}>
                <button
                    onClick={() => {
                        setTab('catalog');
                        setShowCart(true);
                    }}
                    className="btn btn-outline-light"
                >
                    🛒
                </button>
                {totalQuantity > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '3px 6px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                    }}>
            {totalQuantity}
          </span>
                )}
            </div>

            <div>
                {user ? (
                    <>
                        <span style={{marginRight: '15px'}}>Пользователь: {user.username}</span>
                        <button
                            onClick={onLogout}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                            }}
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <button
                        onClick={onLoginClick}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                    >
                        Войти в систему
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
