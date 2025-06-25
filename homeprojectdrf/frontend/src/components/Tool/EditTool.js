
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loader from "../Common/Loader";
import "./Tool.css";

const EditTool = () => {
  const [tool, setTool] = useState({});
  const [product, setProduct] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const getToolApi = "http://127.0.0.1:8000/api/tools/";
  const API_PRODUCT = "http://127.0.0.1:8000/api/products/";

  useEffect(() => {
    getTool();
  }, [id]);

  useEffect(() => {
    if (tool.product_id) {
      axios
        .get(`${API_PRODUCT}${tool.product_id}/`)
        .then((response) => {
          setProduct(response.data);
        })
        .catch((err) => {
          console.error("Ошибка загрузки продукта:", err);
        });
    }
  }, [tool.product_id]);

  const getTool = () => {
    axios
      .get(`${getToolApi}${id}/`)
      .then((response) => {
        setTool(response.data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки инструмента:", err);
      });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setTool({ ...tool, [name]: value });
  };

  const handleInputProduct = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setTool((prev) => ({
      ...prev,
      image_url: file,
    }));
  };

  const handleCombinedSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      for (const key in tool) {
        formData.append(key, tool[key]);
      }

      await axios.put(`${getToolApi}${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      await axios.put(`${API_PRODUCT}${product.id}/`, product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tool-form">
      <Link to="/">В каталог</Link>
      <div className="heading">
        {isLoading && <Loader />}
        {error && <p className="error-message">Ошибка: {error}</p>}
        <p>Форма для редактирования</p>
      </div>
      <form onSubmit={handleCombinedSubmit}>
        <div className="mb-3">
          <label className="form-label">Бренд</label>
          <input type="text" name="brand_tool" value={tool.brand_tool || ""} onChange={handleInput} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Тип инструмента</label>
          <select name="type_tool" value={tool.type_tool || ""} onChange={handleInput} className="form-control">
            <option value="">-- Выберите тип --</option>
            <option value="фреза">Фреза</option>
            <option value="сверло">Сверло</option>
            <option value="развертка">Развертка</option>
            <option value="метчик">Метчик</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Диаметр</label>
          <input type="number" name="diametr" value={tool.diametr || ""} onChange={handleInput} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Рабочая длина</label>
          <input type="number" name="working_length_tool" value={tool.working_length_tool || ""} onChange={handleInput} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Длина инструмента</label>
          <input type="number" name="length_tool" value={tool.length_tool || ""} onChange={handleInput} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Материал заготовки</label>
          <input type="text" name="material_of_detail" value={tool.material_of_detail || ""} onChange={handleInput} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Материал инструмента</label>
          <input type="text" name="material_of_tool" value={tool.material_of_tool || ""} onChange={handleInput} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Описание</label>
          <textarea name="description" value={tool.description || ""} onChange={handleInput} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Фото</label>
          <input type="file" name="image_url" accept="image/*" onChange={handleImageChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Цена</label>
          <input type="number" name="price" value={product.price || ""} onChange={handleInputProduct} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Сохранить изменения</button>
      </form>
    </div>
  );
};

export default EditTool;
