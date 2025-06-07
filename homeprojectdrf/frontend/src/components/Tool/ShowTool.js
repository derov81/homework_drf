import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Common/Loader";
import AuthService from "../services/authService";
import './Tool.css';
import { Image } from "react-bootstrap";
import { useCart } from "../Cart/CartContext";

export default function ShowTool() {
  const API_URL = "http://127.0.0.1:8000/api/tools/";
  const API_PRODUCT = "http://127.0.0.1:8000/api/products/";
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [typeFilter, setTypeFilter] = useState("all");

  const user = AuthService.getCurrentUser();

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот инструмент?')) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTools(prevTools => prevTools.filter(tool => tool.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      setError(error.response?.data?.detail || 'Ошибка при удалении инструмента');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTools = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTools(response.data);

      const responsePro = await axios.get(API_PRODUCT, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts(responsePro.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setError(error.response?.data?.detail || 'Ошибка при загрузке инструментов');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleBuy = (toolId) => {
    const tool = tools.find(t => t.id === toolId);
    const matchedProduct = products.find(p => p.id === tool?.product_id || p.tool_id === toolId);
    const productId = tool?.product_id || matchedProduct?.id;

    console.log("🛒 Покупка", { toolId, tool, productId });

    if (!productId) {
      alert("Product ID не найден");
      return;
    }

    addToCart(productId, 1);
    alert("Добавлено в корзину!");
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.brand_tool.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || tool.type_tool.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTools.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!tools.length) return (
    <div className="alert alert-info">
      Инструменты не найдены<br />
      {user && <Link to={'api/tools/create/'}>Добавить инструмент</Link>}
    </div>
  );

  return (
    <div className="container mt-5">
      <h3 className="text-center">Список инструментов</h3>

      <div className="d-flex justify-content-between mb-3">
        {user && <Link to={'api/tools/create/'}>Добавить инструмент</Link>}
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Поиск по наименованию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Фильтр по типу инструмента:</label>
        <div className="d-flex gap-3 flex-wrap">
          <div>
            <input
              type="radio"
              id="all"
              name="typeFilter"
              value="all"
              checked={typeFilter === "all"}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
            <label htmlFor="all" className="ms-1">Все</label>
          </div>
          {["фреза", "сверло", "развертка", "метчик"].map((type) => (
            <div key={type}>
              <input
                type="radio"
                id={type}
                name="typeFilter"
                value={type}
                checked={typeFilter === type}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
              <label htmlFor={type} className="ms-1">{type.charAt(0).toUpperCase() + type.slice(1)}</label>
            </div>
          ))}
        </div>
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>№</th>
            <th>Фото</th>
            <th>Наименование</th>
            <th>Тип</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((tool, index) => (
            <tr key={tool.id}>
              <td>{index + 1}</td>
              <td><Image src={tool.image_url} width={38} height={38} /></td>
              <td>{tool.brand_tool}</td>
              <td>{tool.type_tool}</td>
              <td>
                {products.find(p => p.id === tool.product_id)?.price ?? 0.00} ₽
              </td>
              <td>
                <div className="btn-group" role="group">
                  {user && (
                    <Link
                      to={`api/tools/${tool.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="fa fa-pencil"></i>
                    </Link>
                  )}
                  <Link
                    to={`api/tools/show/${tool.id}`}
                    className="btn btn-sm btn-outline-info"
                  >
                    <i className="fa fa-eye"></i>
                  </Link>
                  {user?.username === 'admin' && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(tool.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  )}
                  {user && (
                      <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleBuy(tool.id)}
                      >
                        Купить
                      </button>
                  )}

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center my-3 gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Назад
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn ${currentPage === i + 1 ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="btn btn-outline-secondary"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Вперёд
        </button>
      </div>
    </div>
  );
}
