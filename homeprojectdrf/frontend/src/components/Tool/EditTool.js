import axios from "axios";
import React, { useEffect, useState } from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import Loader from "../Common/Loader";
import "./Tool.css";
//import AuthService from "../../services/authService";

const EditTool = () => {
  const [tool, setTool] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const getToolApi = "http://127.0.0.1:8000/api/tools/";

  useEffect(() => {
    getTool();
  }, [id]);  // Добавляем зависимость, чтобы запрос выполнялся только при изменении id

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

  const handelInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setTool({ ...tool, [name]: value });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios.put(`${getToolApi}${id}/`, tool, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        console.log("Инструмент обновлен:", response.data);
        navigate("/");
      })
      .catch((error) => {
      // Проверка, если ошибка - это объект с ключом detail
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);  // Устанавливаем строку ошибки
      setIsLoading(false);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setTool((prev) => ({
        ...prev,
        image_url: file,
    }));
};


  return (
    <div className="tool-form">
      <Link to={'/'}>На главную</Link>
      <div className="heading">
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <p>Форма для редактирования</p>
      </div>
      <form onSubmit={handelSubmit}>
        <div className="mb-3">
          <label htmlFor="brand_tool" className="form-label">Бренд</label>
          <input
              type="text"
              className="form-control"
              id="brand_tool"
              name="brand_tool"
              value={tool.brand_tool || ''}
              onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type_tool" className="form-label">Тип инструмента</label>
          <input
              type="text"
              className="form-control"
              id="type_tool"
              name="type_tool"
              value={tool.type_tool || ''}
              onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="working_length_tool" className="form-label">Диаметр инструмента</label>
          <input
              type="number"
              className="form-control"
              id="diametr"
              name="diametr"
              value={tool.diametr || ''}
              onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="working_length_tool" className="form-label">Рабочая днина</label>
          <input
              type="number"
              className="form-control"
              id="working_length_tool"
              name="working_length_tool"
              value={tool.working_length_tool || ''}
              onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="length_tool" className="form-label">Длина инструмента</label>
          <input
              type="number"
              className="form-control"
              id="length_tool"
              name="length_tool"
              value={tool.length_tool || ''}
              onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="material_of_detail" className="form-label">Материал заготовки</label>
          <input
              type="text"
              className="form-control"
              id="material_of_detail"
              name="material_of_detail"
              value={tool.material_of_detail || ''}
              onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="material_of_tool" className="form-label">Материал инструмента</label>
          <input
              type="text"
              className="form-control"
              id="material_of_tool"
              name="material_of_tool"
              value={tool.material_of_tool || ''}
              onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="short_description" className="form-label">Краткое описание</label>
          <input
              type="text"
              className="form-control"
              id="short_description"
              name="short_description"
              value={tool.short_description || ''}
              onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Oписание</label>
          <textarea
              className="form-control"
              id="description"
              name="description"
              value={tool.description || ''}
              onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image_url" className="form-label">Фото</label>
          <input
              type="file"
              className="form-control"
              name="image_url"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary submit-btn">Сохранить изменения</button>
      </form>
    </div>
  );
};

export default EditTool;