import logo from "./logo.png";
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';

import './Login.css';
import CarList from './CarList';
import CarAddForm from './CarAddForm';
import RentCar from "./RentCar";
import Dashboard from "./Dashboard";
import Register from './Register';
import CarDetail from "./CarDetail";
import RentingDetail from './RentingDetail';
import CarRentingHistory from './CarRentingHistory';
import CarEditForm from './CarEditForm';
import EditRenting from './EditRenting';
import AddRentingForm from './AddRentingForm';

function Login({ onLogin }) {
    const handleSubmit = async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!email) {
            alert("Email wymagany");
        } else if (!password) {
            alert("Hasło wymagane");
        } else {
            try {
                const response = await fetch('http://localhost:3000/auth/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                alert('Zalogowano');
                e.target.email.value = "";
                e.target.password.value = "";
                onLogin();
            } catch (error) {
                alert('Błąd logowania: ' + error.message);
            }
        }
    };

    return (
        <>
            <img src={logo} className="logo" alt="Logo wypożyczalni" />
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="name@example.com" />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Hasło</label>
                    <input type="password" name="password" />
                </div>
                <button className="primary">Zaloguj się</button>
            </form>
            <Link to="/register">
                <button className="secondary">Utwórz nowe konto</button>
            </Link>
        </>
    );
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/car-list" element={isAuthenticated ? <CarList /> : <Navigate to="/" />} />
                    <Route path="/car-add" element={isAuthenticated ? <CarAddForm /> : <Navigate to="/" />} />
                    <Route path="/rent-car" element={isAuthenticated ? <RentCar /> : <Navigate to="/" />} />
                    <Route path="/cars/:id" element={isAuthenticated ? <CarDetail /> : <Navigate to="/" />} />
                    <Route path="/rentings" element={isAuthenticated ? <RentCar /> : <Navigate to="/" />} />
                    <Route path="/rentings/new" element={isAuthenticated ? <AddRentingForm /> : <Navigate to="/" />} />
                    <Route path="/rentings/:id" element={isAuthenticated ? <RentingDetail /> : <Navigate to="/" />} />
                    <Route path="/car-renting-history" element={isAuthenticated ? <CarRentingHistory /> : <Navigate to="/" />} />
                    <Route path="/car-edit/:id" element={isAuthenticated ? <CarEditForm /> : <Navigate to="/" />} />
                    <Route path="/rentings/edit/:id" element={isAuthenticated ? <EditRenting /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
