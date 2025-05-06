import React from "react";
import './Home.css'
import backgroundImage from './imageSection/fon_main.png';
import {useNavigate} from 'react-router-dom';


export default function Home({ setTab }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };
    return (
        <section>
            <div className="hero"
                 style={{
                     backgroundImage: `url(${backgroundImage})`,
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: 'center',
                     backgroundSize: 'cover',
                 }}
            >
                <div className="hero-content">
                    <h1>
                        Профессиональный<br/>
                        режущий инструмент<br/>
                        для любых задач
                    </h1>
                    <button onClick={() => setTab('catalog')}>
                        Перейти в каталог
                    </button>
                </div>
            </div>
        </section>
    )
}

