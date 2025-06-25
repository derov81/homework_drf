import React, { useEffect, useState } from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

const UserCabinet = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const CABINET = "http://127.0.0.1:8000/api/cabinet/"

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(CABINET, {
        headers: {
             'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки данных:", err);
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["first_name", "last_name", "patronymic", "birthdate"].includes(name)) {
      setUserData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [name]: value },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    axios
      .put(CABINET, userData, {
        headers: {
             'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => alert("✅ Данные успешно обновлены"))
      .catch((err) => console.error("Ошибка при сохранении:", err));
  };
  //     try {
  //     const formData = new FormData();
  //     for (const key in userData) {
  //       formData.append(key, userData[key]);
  //     }
  //     axios.put(`${CABINET}${id}/`, userData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });

  if (loading) return <div className="container mt-5">Загрузка...</div>;
  if (!userData) return <div className="container mt-5">Ошибка загрузки данных</div>;

  return (
    <div className="container mt-5">
      <h2>Личный кабинет</h2>

      <div className="form-group">
        <label>Имя пользователя:</label>
        <input className="form-control" value={userData.username} disabled />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          className="form-control"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Имя:</label>
        <input
          className="form-control"
          name="first_name"
          value={userData.profile?.first_name || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Фамилия:</label>
        <input
          className="form-control"
          name="last_name"
          value={userData.profile?.last_name || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Отчество:</label>
        <input
          className="form-control"
          name="patronymic"
          value={userData.profile?.patronymic || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Дата рождения:</label>
        <input
          type="date"
          className="form-control"
          name="birthdate"
          value={userData.profile?.birthdate || ""}
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-primary mt-3" onClick={handleSave}>
        Сохранить
      </button>
    </div>
  );
};

export default UserCabinet;
