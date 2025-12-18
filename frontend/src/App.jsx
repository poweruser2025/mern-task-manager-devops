import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function App() {
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };
  return (
    <div>
      <nav style={{ padding: 12 }}>
        <Link to="/board">Board</Link> | <Link to="/login">Login</Link> | <button onClick={logout}>Logout</button>
      </nav>
      <Outlet />
    </div>
  );
}
