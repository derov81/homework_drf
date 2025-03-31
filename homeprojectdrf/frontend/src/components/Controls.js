import React from 'react';

const Controls = ({onEdit, onDelete}) =>(
    <div style={{display: 'grid', gap: '5px', justifyContent: 'center'}}>

            <button onClick={onEdit} style={{
                backgroundColor: "#f66a07",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer"
            }}>
                Изменить
            </button>
            <button onClick={onDelete} style={{
                backgroundColor: "#f40530",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer"
            }}>
                Удалить
            </button>

    </div>
);

export default Controls;
