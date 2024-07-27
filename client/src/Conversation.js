import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageForm from "./MessageForm";

function Conversation() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch(`http://localhost:5555/conversations/${id}`);
            const data = await response.json();
            setMessages(data);
        };
        fetchMessages();
    }, [id]);

    return (
        <div>
            <h1>Conversation {id}</h1>
            <ul>
                {messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((message) => (
                    <li key={message.id}>
                        <strong>{message.author_id}:</strong> {message.content}
                    </li>
                ))}
            </ul>
            <MessageForm conversationId={id} setMessages={setMessages} />
        </div>
    );
};

export default Conversation;