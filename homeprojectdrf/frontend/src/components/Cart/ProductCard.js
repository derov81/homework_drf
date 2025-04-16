import { useCart } from "./CartContext";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="card">
            <img src={product.image} className="card-img-top" alt={product.name} />
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.price} ₽</p>
                <button className="btn btn-success" onClick={() => addToCart(product)}>
                    Купить
                </button>
            </div>
        </div>
    );
}
