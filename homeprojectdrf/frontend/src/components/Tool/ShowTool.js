import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Loader from "../Common/Loader";
import AuthService from "../../services/authService";
import './Tool.css'
import {Image} from "react-bootstrap";
//import SearchTools from "./SearchTools";


export default function ShowTool() {
    const API_URL = "http://127.0.0.1:8000/api/tools/";
    const [tools, setTools] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


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
            <div className="alert alert-info" >
                Инструменты не найдены
                <br/>
                {user && (
                    <Link to={'api/tools/create/'}>Добавить инструмент</Link>
                )
                }
            </div>
        );
    }


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
                    {/*<th>Рабочая длина</th>*/}
                    {/*<th>Общая длина</th>*/}
                    {/*<th>Материал обработки</th>*/}
                    {/*<th>Материал инструмента</th>*/}
                    {/*<th>Краткое описание</th>*/}
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>

                {tools.map((tool, index) => (
                    <tr key={tool.id}>
                        <td>{index + 1}</td>
                        <td>{<Image src={tool.image_url} width={38} height={38}/>}</td>
                        <td>{tool.brand_tool}</td>
                        <td>{tool.type_tool}</td>
                        {/*<td>{tool.working_length_tool}</td>*/}
                        {/*<td>{tool.length_tool}</td>*/}
                        {/*<td>{tool.material_of_detail}</td>*/}
                        {/*<td>{tool.material_of_tool}</td>*/}
                        {/*<td>{tool.short_description}</td>*/}
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
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    );
};

