import React from "react";
import { useNavigate } from 'react-router-dom';
import "./NavBar.css";

function NavBar({ setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch("http://localhost:5555/logout", {
            method: "DELETE",
            credentials: "include",
        }).then(() => {
            setUser(null);
            navigate("/login");
        });
    };

    return (
        <nav className="navbar">
            <button className="nav-button" onClick={() => navigate("/users")}>Users</button>
            <button className="nav-button" onClick={() => navigate("/conversations")}>Conversations</button>
            <button className="nav-button" onClick={() => navigate("/message-form")}>Message</button>
            <button className="nav-button" onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default NavBar;