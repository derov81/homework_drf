import React from "react";
import './Home.css'
import backgroundImage from './imageSection/fon_main.png';



export default function Home({ setTab }) {

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

