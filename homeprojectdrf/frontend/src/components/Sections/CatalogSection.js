import React from "react";
import ShowTool from "../Tool/ShowTool";
import {Routes, Route} from "react-router-dom";
import Tool from "../Tool/Tool";
import EditTool from "../Tool/EditTool";
import CreateTool from "../Tool/CreateTool";
import {CartProvider} from '../Cart/CartContext';
import CartPage from "../Cart/CartPage";
import CheckoutPage from "../Cart/CheckoutPage";




export default function CatalogSection(){

    return(
        <section>
            <CartProvider>
                    <Routes>
                        <Route path="/api/tools/create" element={<CreateTool/>}/>
                        <Route path="/api/tools/:id" element={<EditTool/>}/>
                        <Route path="/" element={<ShowTool/>}/>
                        <Route path="/api/tools/show/:id" element={<Tool/>}/>
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                    </Routes>
            </CartProvider>
        </section>
    )
}