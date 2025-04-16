import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./Tool.css";

const Tool = () => {
  const [tool, setTool] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const getToolApi = "http://localhost:8000/api/tools/";

  useEffect(() => {
    getTool();
  }, [id]);

  const getTool = async () => {
    try {
      const response = await axios.get(`${getToolApi}${id}/`);
      setTool(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке инструмента:", err);
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
      <Link to="/">← На главную</Link>
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
      </div>

      {/* Модальное окно для увеличенного изображения */}
      <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static">
        <Modal.Body className="text-center p-0">
          <img
            src={tool.image_url}
            alt="Увеличенное изображение"
            className="img-fluid"
            style={{ maxHeight: "80vh", objectFit: "contain" }}
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
