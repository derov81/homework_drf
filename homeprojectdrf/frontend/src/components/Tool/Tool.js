import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import "./Tool.css";
import {Image} from "react-bootstrap";

const Tool = () => {
  const [tool, setTool] = useState([]);
  const { id } = useParams();
  const getToolApi = "http://localhost:8000/api/tools/";
  const [size, setSize] = useState(1);

  useEffect(() => {
    getTool();
  });

  const getTool = () => {
    axios
      .get(`${getToolApi}${id}/`)
      .then((item) => {
        setTool(item.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

   const handleClick = () => {
    setSize(size === 1 ? 2 : 1); // Увеличиваем в 2 раза, а затем возвращаем обратно
  };

  return (

    <div className="tool mt-5">
        <Link to={'/'}>На главную</Link>
      <div className="tool">
        <h2 className="tool h2"> {tool.brand_tool} </h2>
          <p className="tool img">{<Image
              src={tool.image_url}
              width={330 * size}
              height={220 * size}
              onClick={handleClick}
              style={{ cursor: "pointer", transition: "0.3s" }}
              alt="Zoomable"
          />}</p>
          <p>{tool.description}</p>
      </div>
    </div>
  );
};
export default Tool;