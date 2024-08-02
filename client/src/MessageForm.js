import React, { useState } from 'react';
import './MessageForm.css';

function MessageForm({ conversationId, setMessages }) {
    const [message, setMessage] = useState('');

    const handleSendMessage = async () => {
        const response = await fetch(`http://localhost:5555/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
            credentials: 'include',  
        });
        const newMessage = await response.json();
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage('');
    };

    return (
        <div className="input-button-container">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="message-input"
            />
            <button onClick={handleSendMessage} className="send-button">Send</button>
        </div>
    );
}

export default MessageForm;
