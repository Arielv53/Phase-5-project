import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Conversations() {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            const response = await fetch('http://localhost:5555/conversations');
            const data = await response.json();
            setConversations(data);
        };
        fetchConversations();
    }, []);

    return (
        <div>
            <h1>Conversations</h1>
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
