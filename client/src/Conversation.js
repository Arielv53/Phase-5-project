import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageForm from "./MessageForm";
import './Conversation.css';

function Conversation({ currentUser }) {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [otherUser, setOtherUser] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch(`http://localhost:5555/conversations/${id}`);
            const data = await response.json();
            setMessages(data);

            const userIds = [...new Set(data.map(message => message.author_id))];
            const userResponses = await Promise.all(userIds.map(userId => fetch(`http://localhost:5555/users/${userId}`)));
            const users = await Promise.all(userResponses.map(res => res.json()));

            const usernamesMap = users.reduce((acc, user) => {
                acc[user.id] = user.username;
                return acc;
            }, {});

            setUsernames(usernamesMap);

            const otherUserId = userIds.find(userId => userId !== currentUser);
            if (otherUserId) {
                setOtherUser(usernamesMap[otherUserId]);
            }
        };

        fetchMessages();
    }, [id, currentUser]);

    const handleDeleteMessage = async (messageId) => {
        const response = await fetch(`http://localhost:5555/messages/${messageId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) {
            setMessages(messages.filter(message => message.id !== messageId));
        } else {
            const data = await response.json();
            console.error("Error deleting message:", data.message);
        }
    };

    return (
        <div className="conversation-container">
            <div className="conversation-box">
                <h1 className="conversation-header">{`${otherUser || '...'}`}</h1>
                <ul className="message-list">
                    {messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((message) => (
                        <li key={message.id}
                            className={`message-item ${message.author_id === currentUser ? 'user-message' : 'other-message'}`}
                        >
                            <strong>{message.author_id === currentUser ? 'You' : usernames[message.author_id]}:</strong> {message.content}
                            <div className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</div>
                            {message.author_id === currentUser && (
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteMessage(message.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
                <MessageForm conversationId={id} setMessages={setMessages} />
            </div>
        </div>
    );
};

export default Conversation;