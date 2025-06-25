import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {CartProvider} from "./components/Cart/CartContext";
import {GoogleOAuthProvider} from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CartProvider>
        <BrowserRouter>
            <GoogleOAuthProvider clientId="459926197304-vikdmjtdqoggh6aqae0k352s352arp00.apps.googleusercontent.com">
            <App/>
            </GoogleOAuthProvider>
        </BrowserRouter>
    </CartProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
