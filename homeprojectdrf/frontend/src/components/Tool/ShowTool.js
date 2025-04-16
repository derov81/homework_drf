import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Loader from "../Common/Loader";
import AuthService from "../services/authService";
import './Tool.css'
import {Image} from "react-bootstrap";
import ProductCard from "../Cart/ProductCard";
//import SearchTools from "./SearchTools";


export default function ShowTool() {
    const API_URL = "http://127.0.0.1:8000/api/tools/";
    const [tools, setTools] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(1); // Писем на страницу


    const user = AuthService.getCurrentUser()

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот инструмент?')) {
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTools(response.data);

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

    if (isLoading) {
        return <Loader/>;
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    if (!tools.length) {
        return (
            <div className="alert alert-info">
                Инструменты не найдены
                <br/>
                {user && (
                    <Link to={'api/tools/create/'}>Добавить инструмент</Link>
                )
                }
            </div>
        );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tools.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(tools.length / itemsPerPage);


    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-3">

                <h2>Список инструментов</h2>

                {user && (
                    <Link to={'api/tools/create/'}>Добавить инструмент</Link>
                )
                }

            </div>

            {isLoading && <Loader/>}

            <table className="table table-striped table-hover">
                <thead className="table-dark">
                <tr>
                    <th>№</th>
                    <th>Фото</th>
                    <th>Наименования инструмента</th>
                    <th>Тип</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>

                {currentItems.map((tool, index) => (
                    <tr key={tool.id}>
                        <td>{index + 1}</td>
                        <td>{<Image src={tool.image_url} width={38} height={38}/>}</td>
                        <td>{tool.brand_tool}</td>
                        <td>{tool.type_tool}</td>
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

                                {user &&

                                    (<button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(tool.id)}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>)
                                }

                            </div>
                            {/* Купить */}
                            <ProductCard product={tools}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/* Пагинация */}
            <div className="d-flex justify-content-center my-3 gap-2">
                <button className="btn btn-outline-secondary"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}>Назад
                </button>
                {Array.from({length: totalPages}, (_, i) => (
                    <button key={i} className={`btn ${currentPage === i + 1 ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                ))}
                <button className="btn btn-outline-secondary"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}>Вперёд
                </button>
            </div>
        </div>

    );
};

