import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartConversation.css';

function StartConversation() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleStartChat = async () => {
        try {
            const response = await fetch(`http://localhost:5555/users?search=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const data = await response.json();
            if (data.length > 0) {
                const userId = data[0].id;
                const response = await fetch('http://localhost:5555/conversations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_ids: [userId] }),
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to create conversation');
                }
                const conversation = await response.json();
                navigate(`/conversation/${conversation.conversation_id}`);
            } else {
                alert('User not found');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="start-conversation-container">
            <h1>Start a Chat !</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="username-input"
            />
            <button onClick={handleStartChat} className="chat-button">Chat</button>
        </div>
    );
}

export default StartConversation;
