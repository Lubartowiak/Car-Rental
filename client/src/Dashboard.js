import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ onLogout }) {
    const handleLogout = () => {
        onLogout();
    };

    return (
        <div className="dashboard-container">
            <h1>Wypożyczalnia samochodów</h1>
            <button onClick={handleLogout} className="logout-button">Wyloguj się</button>
            <ul>
                <li>
                    <Link to="/car-list" className="dashboard-link">Lista Samochodów</Link>
                </li>
                <li>
                    <Link to="/rent-car" className="dashboard-link">Wypożycz Samochód</Link>
                </li>
                <li>
                    <Link to="/car-renting-history" className="dashboard-link">Historia wypożyczeń</Link>
                </li>
            </ul>
        </div>
    );
}

export default Dashboard;
