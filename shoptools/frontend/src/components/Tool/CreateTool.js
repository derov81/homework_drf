import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import './Tool.css';
import axios from "axios";

const CreateTool = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        brand_tool: '',
        type_tool: '',
        diametr: '',
        working_length_tool: '',
        length_tool: '',
        material_of_detail: '',
        material_of_tool: '',
        short_description: '',
        description: '',
        price: '',
        image_file: null
    });

    const toolTypes = [
        { value: '', label: '-- Выберите тип --' },
        { value: 'фреза', label: 'Фреза' },
        { value: 'сверло', label: 'Сверло' },
        { value: 'развертка', label: 'Развертка' },
        { value: 'метчик', label: 'Метчик' }
    ];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image_file: e.target.files[0] }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Необходима авторизация');
            }

            const formDataToSend = new FormData();

            // Append all fields except the file
            Object.keys(formData).forEach(key => {
                if (key !== 'image_file' && formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append the file if it exists
            if (formData.image_file) {
                formDataToSend.append('image_url', formData.image_file);
            }

            const response = await axios.post(
                'http://127.0.0.1:8000/api/tools/',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                navigate("/");
            }
        } catch (err) {
            console.error('Ошибка при создании инструмента:', err);
            const errorMessage = err.response?.data?.detail ||
                               err.response?.data?.message ||
                               err.message ||
                               'Произошла ошибка при создании инструмента';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const requiredFields = [
        'brand_tool', 'type_tool', 'diametr',
        'working_length_tool', 'length_tool',
        'material_of_detail', 'material_of_tool'
    ];

    const isFormValid = () => {
        return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
    };

    return (
        <div className='tool-form'>
            <Link to={'/'} className="back-link">В каталог</Link>
            <div className='heading'>
                <h2>Добавить новый инструмент</h2>
                {isLoading && <Loader />}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {/* Brand Input */}
                    <div className="mb-3">
                        <label htmlFor="brand_tool" className="form-label">Бренд*</label>
                        <input
                            type="text"
                            className="form-control"
                            id="brand_tool"
                            name="brand_tool"
                            value={formData.brand_tool}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Tool Type Select */}
                    <div className="mb-3">
                        <label htmlFor="type_tool" className="form-label">Тип инструмента*</label>
                        <select
                            className="form-control"
                            id="type_tool"
                            name="type_tool"
                            value={formData.type_tool}
                            onChange={handleInputChange}
                            required
                        >
                            {toolTypes.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Diameter Input */}
                    <div className="mb-3">
                        <label htmlFor="diametr" className="form-label">Диаметр инструмента*</label>
                        <input
                            type="number"
                            className="form-control"
                            id="diametr"
                            name="diametr"
                            value={formData.diametr}
                            onChange={handleInputChange}
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>

                    {/* Working Length Input */}
                    <div className="mb-3">
                        <label htmlFor="working_length_tool" className="form-label">Рабочая длина*</label>
                        <input
                            type="number"
                            className="form-control"
                            id="working_length_tool"
                            name="working_length_tool"
                            value={formData.working_length_tool}
                            onChange={handleInputChange}
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>

                    {/* Total Length Input */}
                    <div className="mb-3">
                        <label htmlFor="length_tool" className="form-label">Общая длина*</label>
                        <input
                            type="number"
                            className="form-control"
                            id="length_tool"
                            name="length_tool"
                            value={formData.length_tool}
                            onChange={handleInputChange}
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>

                    {/* Material of Detail Input */}
                    <div className="mb-3">
                        <label htmlFor="material_of_detail" className="form-label">Материал заготовки*</label>
                        <input
                            type="text"
                            className="form-control"
                            id="material_of_detail"
                            name="material_of_detail"
                            value={formData.material_of_detail}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Material of Tool Input */}
                    <div className="mb-3">
                        <label htmlFor="material_of_tool" className="form-label">Материал инструмента*</label>
                        <input
                            type="text"
                            className="form-control"
                            id="material_of_tool"
                            name="material_of_tool"
                            value={formData.material_of_tool}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Description Textarea */}
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Описание</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                        />
                    </div>

                    {/* Price Input */}
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Цена</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="mb-3">
                        <label htmlFor="image_file" className="form-label">Фото</label>
                        <input
                            type="file"
                            className="form-control"
                            id="image_file"
                            name="image_file"
                            accept="image/jpeg, image/png, image/gif"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Form Buttons */}
                    <div className="d-grid gap-2">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading || !isFormValid()}
                        >
                            {isLoading ? 'Создание...' : 'Создать инструмент'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/")}
                            disabled={isLoading}
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