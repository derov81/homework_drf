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
import UserCabinetSection from "./components/Sections/UserCabenSetection";



const App = () => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [tab, setTab] = useState('main');
    const [showCart, setShowCart] = useState(false);


    useEffect(() => {
        // Check for a saved user when the app loads
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
            setUser(savedUser);
            setShowLogin(false); // Hide login form if the user is already authenticated
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        console.log('Successful login:', userData);
        setUser(userData);
        setShowLogin(false);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setShowLogin(false); // Hide login form after logout
    };

    const handleLoginClick = () => {
        console.log('Opening login form');
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
            {showLogin && (
                <Login
                    show={showLogin}
                    onLoginSuccess={handleLoginSuccess}
                    setShowLogin={setShowLogin}
                />
            )}

            <main className="main-content">
                <TabsSection active={tab} onChange={(current) => setTab(current)}/>

                {tab === 'main' && !selectedOrder && (
                    <Home onSelect={(orderId) => setSelectedOrder(orderId)} setTab={setTab}/>
                )}

                {tab === 'catalog' && (
                    showCart
                        ? <CartPage setTab={setTab} setShowCart={setShowCart}/> // Show CartPage if cart is shown
                        : <CatalogSection/>  // Otherwise, show Catalog
                )}

                {tab === 'feedback' && <FeedbackSection/>}
                {tab === 'cabinet' && <UserCabinetSection/>}
                {tab === 'admin_panel' && <AdminPanel/>}
                {tab === 'about' && <AboutSection/>}
            </main>
            <Footer/>
        </div>
    );
};

export default App;
