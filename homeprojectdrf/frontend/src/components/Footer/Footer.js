import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-5">
            <small>© {new Date().getFullYear()} Разработчик: Yaroslav Derov</small>
        </footer>
    );
}
