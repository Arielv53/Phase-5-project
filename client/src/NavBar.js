import React from "react";
import { useNavigate } from 'react-router-dom';
import "./NavBar.css";

function NavBar({ setUser, user }) {
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
            {user.profile_photo && (
                <img
                    src={`http://localhost:5555/static/uploads/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA0L3Jhd3BpeGVsX29mZmljZV8zNF9jdXRlX2NodWJieV9jaGlodWFodWFfZHJlYW15X3dhbGxwYXBlcl9jYXJ0b19iYzA.jpg/${user.profile_photo}`}
                    alt={`${user.username}'s profile`}
                    className="nav-profile-photo"
                />
            )}
            <span className="nav-username">{user.username}</span>
            <button className="nav-button" onClick={() => navigate("/users")}>Users</button>
            <button className="nav-button" onClick={() => navigate("/conversations")}>Conversations</button>
            <button className="nav-button" onClick={() => navigate("/message-form")}>New Conversation</button>
            <button className="nav-button" onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default NavBar;