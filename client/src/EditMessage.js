import React, { useState } from "react";

function EditMessage({ id, body, onUpateMessage }) {
    const [messageBody, setMessageBody] = useState(body);

    function handleFormSubmit(e) {
        e.preventDefault();

        fetch(`http://localhost:5555/messages/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                body: messageBody,
            }),
        })
            .then((r) => r.json())
            .then((updatedMessage) => onUpateMessage(updatedMessage));
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <input
            type="text"
            name="body"
            autoComplete="off"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            />
            <input type="submit" value="Save" />
        </form>
    );
};

export default EditMessage;