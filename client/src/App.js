import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import UsersList from './UsersList';
import Conversations from './Conversations';
import Conversation from './Conversation';
import StartConversation from './StartConversation';

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch("http://localhost:5555/check_session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return undefined;
        }
      })
      .then((data) => {
        console.log("userLoader data", data);
        setUser(data);
      });
  }, []);

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <Router>
      {user && <NavBar setUser={setUser} user={user} />}
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/users" />}
        />
        <Route
          path="/users"
          element={<ProtectedRoute user={user} element={<UsersList />} />}
        />
        <Route
          path="/conversations"
          element={<ProtectedRoute user={user} element={<Conversations currentUser={user.username}/>} />}
        />
        <Route
          path="/conversation/:id"
          element={<ProtectedRoute user={user} element={<Conversation currentUser={user.id}/>} />}
        />
        <Route
          path="/message-form"
          element={<ProtectedRoute user={user} element={<StartConversation />} />}
        />
        <Route
          path="/"
          element={!user ? <Navigate to="/login" /> : <Navigate to="/users" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
