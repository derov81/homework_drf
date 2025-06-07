import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./Tool.css";
import AuthService from "../services/authService";

const Tool = () => {
  const [tool, setTool] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const getToolApi = "http://localhost:8000/api/tools/";
  const API_PRODUCT = "http://127.0.0.1:8000/api/products/";
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const user = AuthService.getCurrentUser();

  useEffect(() => {
    getTool();
    fetchProducts();
  }, [id]);

  const getTool = async () => {
    try {
      const response = await axios.get(`${getToolApi}${id}/`);
      setTool(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке инструмента:", err);
    }
  };


  const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProducts(response.data);
    };

  const increaseQuantity = (toolId) => {
    setQuantities(prev => ({
        ...prev,
        [toolId]: (prev[toolId] || 1) + 1,
    }));
};

const decreaseQuantity = (toolId) => {
    setQuantities(prev => ({
        ...prev,
        [toolId]: Math.max((prev[toolId] || 1) - 1, 1),
    }));
};

const handleBuy = async (toolId) => {
    const token = localStorage.getItem("token");

    try {
        const productId = tool?.product_id;
        const quantity = quantities[toolId] || 1;

        if (!productId) {
            alert("Product ID не найден");
            return;
        }

        console.log("Отправка в корзину:", { product_id: productId, quantity });

        await axios.post(
            "http://127.0.0.1:8000/api/cart/",
            {
                product_id: productId,
                quantity: quantity,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        alert("Инструмент добавлен в корзину");
    } catch (err) {
        console.error("Ошибка при покупке:", err);
        alert("Не удалось купить инструмент");
    }
};


  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <Link to="/">← В каталог</Link>
      <h2 className="mt-3 mb-4">{tool.brand_tool}</h2>

      <div className="row align-items-start">
        <div className="col-md-5">
          <img
            src={tool.image_url}
            alt="Инструмент"
            className="img-fluid rounded shadow-sm"
            style={{ cursor: "pointer" }}
            onClick={handleImageClick}
          />
        </div>
        <div className="col-md-7">
          <p className="lead">{tool.description}</p>
        </div>
          {user && (
              <div>
                  {
                      products.find(p => p.id === tool.product_id)?.price ?? 0.00
                  } ₽
              </div>
          )}

          <div>
              {user && (
                  <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleBuy(tool.id)}
                  >
                      Купить
                  </button>
              )}
          </div>
      </div>

        {/* Модальное окно для увеличенного изображения */}
        <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static">
        <Modal.Body className="text-center p-0">
                <img
                    src={tool.image_url}
                    alt="Увеличенное изображение"
                    className="img-fluid"
                    style={{maxHeight: "80vh", objectFit: "contain"}}
                />
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="secondary" onClick={handleCloseModal}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  );
};

export default Tool;
