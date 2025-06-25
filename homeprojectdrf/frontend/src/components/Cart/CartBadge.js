import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

export default function CartBadge() {
    const { cart } = useCart();

    
    return (
        <Link to="/cart" className="btn btn-outline-primary position-relative">
            🛒
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
            </span>
        </Link>
    );
}
