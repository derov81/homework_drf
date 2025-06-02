import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Loader from "../Common/Loader";
import './Tool.css'
import axios from "axios";



const CreateTool = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [tool, setTool] = useState({
        brand_tool: '',
        type_tool: '',
        diametr: '',
        working_length_tool: '',
        length_tool: '',
        material_of_detail: '',
        material_of_tool: '',
        short_description: '',
        description: '',
        image_url: '',
    });
    const [product, setProduct] = useState({
        price: '',
    });


    const handleInput = (event) => {
        const {name, value} = event.target;
        setTool(prev => ({...prev, [name]: value}));
    };

    const handleInputProduct = (event) => {
        const {name, value} = event.target;
        setProduct(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            console.log('Используемый токен:', token);

            if (!token) {
                throw new Error('Необходима авторизация');
            }

            const formData = new FormData();
            for (const key in tool) {
                formData.append(key, tool[key]);
            }
            formData.append("price", product.price);

            console.log('Отправляемые данные:', tool); // Логируем данные перед отправкой

            const response = await axios.post(
                'http://127.0.0.1:8000/api/tools/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            console.log('Ответ сервера:', response); // Логируем ответ сервера

            if (response.status === 201) {
                navigate("/");
            }
        } catch (err) {
            console.error('Ошибка при создании инструмента:', err);
            console.log('Ответ от сервера:', err.response?.data); // Для получения подробной ошибки
            setError(err.response?.data?.detail || err.message || 'Произошла ошибка при создании инструмента');
        } finally {
            setIsLoading(false);
        }
    };



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setTool((prev) => ({
            ...prev,
            image_url: file,
            //src: require('./media/images/nophot.jpg').default,
        }));
    };
    return (
        <div className='tool-form'>
            <Link to={'/'}>В каталог</Link>
            <div className='heading'>
                {isLoading && <Loader/>}
                {error && <p>Error: {error}</p>}
                <p>Добавить новый инструмент</p>
            </div>
            <div className="card-body">
                {isLoading && <Loader/>}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Бренд*</label>
                        <input
                            type="text"
                            className="form-control"
                            id="brand_tool"
                            name="brand_tool"
                            value={tool.brand_tool}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Тип инструмента*</label>
                        <select
                            className="form-control"
                            id="type_tool"
                            name="type_tool"
                            value={tool.type_tool}
                            onChange={handleInput}
                            required
                        >
                            <option value="">-- Выберите тип --</option>
                            <option value="фреза">Фреза</option>
                            <option value="сверло">Сверло</option>
                            <option value="развертка">Развертка</option>
                            <option value="метчик">Метчик</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Диаметр инструмента*</label>
                        <input
                            type="number"
                            className="form-control"
                            id="diametr"
                            name="diametr"
                            value={tool.diametr}
                            onChange={handleInput}
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Рабочая длина*</label>
                        <input
                            type="number"
                            className="form-control"
                            id="working_length_tool"
                            name="working_length_tool"
                            value={tool.working_length_tool}
                            onChange={handleInput}
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Общая длина*</label>
                        <input
                            type="number"
                            className="form-control"
                            id="length_tool"
                            name="length_tool"
                            value={tool.length_tool}
                            onChange={handleInput}
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Материал заготовки*</label>
                        <input
                            type="text"
                            className="form-control"
                            id="material_of_detail"
                            name="material_of_detail"
                            value={tool.material_of_detail}
                            onChange={handleInput}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Материал инструмента*</label>
                        <input
                            type="text"
                            className="form-control"
                            id="material_of_tool"
                            name="material_of_tool"
                            value={tool.material_of_tool}
                            onChange={handleInput}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Описание</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={tool.description}
                            onChange={handleInput}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Фото</label>
                        <input
                            type="file"
                            className="form-control"
                            name="image_url"
                            accept="image/jpeg, image/png, image/gif"

                            onChange={handleImageChange}
                        />
                        <label htmlFor="price" className="form-label">Цена</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            name="price"
                            value={product.price || ''}
                            onChange={handleInputProduct}
                        />
                    </div>

                    <div className="d-grid gap-2">

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Создание...' : 'Создать инструмент'}
                        </button>


                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/")}
                        >
                            Отмена
                        </button>
                    </div>
                </form>

            </div>
        </div>

    );
};


export default CreateTool;