import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import PrivateRoute from './PrivateRoute';
import Logout from './LogoutPage';
import Layout from './Layout';

import HomePage from './HomePage';
import TaskPage from './TaskPage';

import NotFoundPage from './NotFoundPage';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;

        if (isExpired) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />

        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <RegisterPage />} />
        <Route path="/logout" element={<Logout />} />
        
        <Route element={<Layout />}>
          <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
          <Route path="/task/:id" element={<PrivateRoute element={<TaskPage />} />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
