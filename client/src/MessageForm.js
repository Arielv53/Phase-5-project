import React, { useState } from 'react';

function MessageForm({ conversationId, setMessages }) {
    const [message, setMessage] = useState('');

    const handleSendMessage = async () => {
        const response = await fetch(`http://localhost:5555/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
            credentials: 'include',  // Ensure cookies are sent with the request
        });
        const newMessage = await response.json();
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage('');
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default MessageForm;
