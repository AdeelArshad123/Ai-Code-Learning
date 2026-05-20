import React from 'react';

function Dashboard({ user, handleLogout }) {
  const profile = user.profile;
  const provider = user.provider;

  let name = '';
  if (provider === 'github') {
    name = profile.name || profile.login;
  } else if (provider === 'google') {
    name = profile.name;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {name}!</p>
      <p>You are logged in with {provider}.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
