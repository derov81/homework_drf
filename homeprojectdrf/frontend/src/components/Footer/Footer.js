import React from 'react';
import LoginWithGoogle from "../Login/LoginWithGoogle";

export default function Footer() {
    return (
        <footer className=" text-white text-center py-3 mt-5"
        style={{
            backgroundColor: '#1e3a8a',
            color: '#FFF',
            textAlign: 'center',
            padding: '10px, 0px',
            fontFamily: 'Courier New Courier monospace',
            fontSize: '20px'
        }}
        >
            <small>© {new Date().getFullYear()} Разработчик: Yaroslav Derov</small>
            <LoginWithGoogle/>
        </footer>
    );
}
