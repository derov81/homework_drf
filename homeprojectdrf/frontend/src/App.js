import React, {useState, useEffect} from 'react';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import authService from './components/services/authService';
import TabsSection from "./components/Sections/TabsSection";
import FeedbackSection from "./components/Sections/FeedbackSection";
import AdminPanel from "./components/Sections/AdminPanel";
import Footer from "./components/Footer/Footer";
import AboutSection from "./components/Sections/AboutSection";
import CatalogSection from "./components/Sections/CatalogSection";
import Home from "./components/Sections/Home";
import CartPage from "./components/Cart/CartPage";


const App = () => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [tab, setTab] = useState('main');
    const [showCart, setShowCart] = useState(false);


    useEffect(() => {
        // При загрузке страницы проверяем наличие пользователя
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
            setUser(savedUser);
            setShowLogin(false); // Явно скрываем форму, если пользователь авторизован
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        console.log('Успешный вход:', userData);
        setUser(userData);
        setShowLogin(false);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setShowLogin(false); // Скрываем форму при выходе
    };

    const handleLoginClick = () => {
        console.log('Открытие формы входа');
        setShowLogin(true);
    };

    return (
        <div>
            <Header
                user={user}
                onLogout={handleLogout}
                onLoginClick={handleLoginClick}
                setTab={setTab}
                setShowCart={setShowCart}
            />
            <Login
                show={showLogin}
                onLoginSuccess={handleLoginSuccess}
                setShowLogin={setShowLogin}
            />


            <main style={{marginLeft: '1rem'}}>
                <TabsSection active={tab} onChange={(current) => setTab(current)}/>

                {tab === 'main' && (
                    <>
                        {!selectedOrder && (
                            <Home onSelect={(orderId) => setSelectedOrder(orderId)}
                                  setTab={setTab}
                            />
                        )}
                    </>
                )}
                {tab === 'catalog' && (
                    showCart
                        ? <CartPage setTab={setTab} setShowCart={setShowCart}/> // показываем корзину
                        : <CatalogSection/>                                            // иначе каталог
                )}
                {tab === 'feedback' && <FeedbackSection/>}
                {tab === 'admin_panel' && <AdminPanel/>}
                {tab === 'about' && <AboutSection/>}

            </main>
            <Footer/>
        </div>
    );
};

export default App;
