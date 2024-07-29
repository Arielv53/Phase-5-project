import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Conversations() {
    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch('http://localhost:5555/conversations', {
                    credentials: 'include', // Include cookies in the request
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

    return (
        <div>
            <h1>Conversations</h1>
            {error && <p>Error: {error.message}</p>}
            <ul>
                {conversations.map((conversation) => (
                    <li key={conversation.id}>
                        <Link to={`/conversation/${conversation.id}`}>Conversation with {conversation.usernames.join(', ')}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Conversations;
