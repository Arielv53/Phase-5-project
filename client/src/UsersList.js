import React, { useState, useEffect } from "react";
import "./UserList.css";

function UsersList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch("http://localhost:5555/users");
            const data = await response.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Users</h1>
            <div className="container">
                {users.map((user) => (
                    <div key={user.id} className="user-box">
                        <h2>{user.username}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersList;