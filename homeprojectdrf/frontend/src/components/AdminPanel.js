import React, {useEffect, useState} from "react";
import axios from "axios";


export default function AdminPanel() {

    const API_URL = "http://127.0.0.1:8000/api/users/";
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: {
                     'Authorization':`Bearer ${token}`
                }
                });

            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };


    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}${id}/`, {
                headers: {
                     'Authorization':`Bearer ${token}`
                }
                });
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user", error);
        }
    };


    return (
        <section>
            <h3>Административная панель</h3>
            <table border="1">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (

                    < tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={() => deleteUser(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </section>
    )
}