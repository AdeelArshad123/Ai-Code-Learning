import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch the user's profile from the backend
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.logged_in) {
          setLoggedIn(true);
          setUser(data.user);
        }
      });
  }, []);

  const handleLogout = () => {
    fetch('/logout')
      .then(res => res.json())
      .then(() => {
        setLoggedIn(false);
        setUser(null);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        {loggedIn && user ? (
          <Dashboard user={user} handleLogout={handleLogout} />
        ) : (
          <div>
            <p>Please log in to continue.</p>
            <a href="/login/google"><button>Login with Google</button></a>
            <a href="/login/github"><button>Login with GitHub</button></a>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
