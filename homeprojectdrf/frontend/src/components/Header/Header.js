import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import "../Common/Common.css";
import axios from "axios";


const Header = ({user, onLogout, onLoginClick}) => {

    const [cartCount, setCartCount] = useState(0);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            axios.get("http://127.0.0.1:8000/api/cart/", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    const items = response.data.items || [];
                    const total = items.reduce((acc, item) => acc + item.quantity, 0);
                    setCartCount(total);
                })
                .catch(error => {
                    console.error("Ошибка при загрузке корзины:", error);
                });
        }
    }, []);



    return (

        <header className=" text-white text-center py-3 mt-0" style={{
            backgroundColor: '#1e3a8a',
            color: '#FFF',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            //boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div className="logo">GROSVER TOOLS</div>
            <div>
                <nav className="navbar navbar-expand-sm navbar-dark">
                    <div className="container-fluid">
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#mynavbar"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                    </div>
                </nav>

            </div>
            <div>
            </div>
            <div style={{marginInline: '30px'}}>
                info@grosvertools.by
            </div>
            <div style={{color:'white'}}>
                +375 (17) 555-55-55
            </div>
            <div>
                <Link to="/cart" className="btn btn-outline-light position-relative">
                    🛒
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartCount}
                    </span>
                </Link>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
                {user ? (
                    <>
                        <span style={{marginRight: '15px'}}>
                            Пользователь: {user.username}
                        </span>
                        <button
                            onClick={onLogout}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
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
                            cursor: 'pointer'
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