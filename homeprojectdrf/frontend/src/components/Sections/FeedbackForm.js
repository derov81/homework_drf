                          import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/feedback/";

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        attachment: null,
    });

    const [statusMessage, setStatusMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, attachment: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("message", formData.message);
        if (formData.attachment) {
            data.append("attachment", formData.attachment);
        }

        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "multipart/form-data",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        try {
            await axios.post(API_URL, data, { headers });
            setStatusMessage("✅ Ваше сообщение отправлено!");
            setFormData({
                name: "",
                email: "",
                message: "",
                attachment: null,
            });
        } catch (error) {
            console.error("Ошибка при отправке:", error);
            setStatusMessage("❌ Не удалось отправить сообщение. Попробуйте позже.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Обратная связь</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label">Имя *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Сообщение *</label>
                    <textarea
                        className="form-control"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Прикрепить файл</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Отправить
                </button>
            </form>

            {statusMessage && (
                <div className="alert alert-info mt-3">{statusMessage}</div>
            )}
        </div>
    );
};

export default FeedbackForm;
