import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchTools = () => {
  const [query, setQuery] = useState("");  // Для хранения запроса поиска
  const [tools, setTools] = useState([]);  // Для хранения найденных инструментов
  const [isLoading, setIsLoading] = useState(false);

  const fetchTools = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/tools/`, {
        params: { name: query },
      });
      setTools(response.data);  // Сохраняем данные в стейте
    } catch (error) {
      console.error("Error fetching tools:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchTools();
    } else {
      setTools([]);  // Очистить результаты поиска при удалении текста
    }
  }, [query]); // Вызываем поиск каждый раз, когда изменяется запрос

  return (
    <div>
      <input
        type="text"
        placeholder="Поиск по инструментам..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Обновляем состояние запроса
      />
      {isLoading && <p>Загрузка...</p>}
      <ul>
        {tools.length > 0 ? (
          tools.map((tool) => (
            <li key={tool.id}>
              {tool.brand_tool} - {tool.type}
            </li>
          ))
        ) : (
          <li>Инструменты не найдены</li>
        )}
      </ul>
    </div>
  );
};

export default SearchTools;