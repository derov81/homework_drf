import React from "react";
import Controls from "./Controls";

const PartsTable = ({parts, selectedOrder, selectedDetail, onSelectDetail, onDelete, onEdit, onAdd}) => (
    <div>
        <h2>Детали</h2>
        <button onClick={onAdd}>Добавить деталь</button>
        {selectedOrder ? (
            <table border="1" cellPadding="10" style={{width: "300px"}}>
                <tbody>
                {parts.map((part) => (
                    <tr
                        key={part.id}
                        onClick={() => onSelectDetail(part.id)}
                        style={{
                            cursor: "pointer",
                            backgroundColor: selectedDetail === part.id ? "#eef" : "",
                        }}
                    >
                        <td>
                            <>
                                <div style={{textAlign: "center"}}>Ид детали: {part.id}</div>
                                <div style={{textAlign: "center"}}>№ Детали: {part.name}</div>
                            </>
                        </td>
                        <td><Controls onDelete={() => onDelete(part.id)}
                                      onEdit={() => onEdit(part)}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        ) : (
            <p>Пожалуйста, выберите заказ, чтобы просмотреть его детали</p>
        )}
    </div>
);

export default PartsTable;