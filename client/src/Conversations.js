import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Conversations.css';

function Conversations({ currentUser }) {
    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch('http://localhost:5555/conversations', {
                    credentials: 'include', 
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setConversations(data);
            } catch (error) {
                console.error("Error fetching conversations:", error);
                setError(error);
            }
        };
        fetchConversations();
    }, []);

    const handleDelete = async (conversationId) => {
        try {
            const response = await fetch(`http://localhost:5555/conversations/${conversationId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setConversations(conversations.filter(conversation => conversation.id !== conversationId));
        } catch (error) {
            console.error("Error deleting conversation:", error);
            setError(error);
        }
    };

    return (
        <div className="conversations-container">
            <h1>Conversations</h1>
            {error && <p>Error: {error.message}</p>}
            <ul className="conversations-list">
                {conversations.map((conversation) => {
                    const otherUser = conversation.usernames.find(username => username !== currentUser);
                    const lastMessage = conversation.messages && conversation.messages.length > 0 
                        ? conversation.messages[conversation.messages.length - 1].text 
                        : "No messages yet";

                    return (
                        <li key={conversation.id} className="conversation-item">
                            <Link to={`/conversation/${conversation.id}`} className="conversation-link">
                                <span className="conversation-username">{otherUser}</span>
                                <span className="conversation-last-message">{lastMessage}</span>
                            </Link>
                            <button className="delete-button" onClick={() => handleDelete(conversation.id)}>Delete</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Conversations;
