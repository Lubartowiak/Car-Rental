import React, { useEffect, useState } from 'react';
import './CarRentingHistory.css';
import { Link } from 'react-router-dom';

function CarRentingHistory() {
    const [carHistories, setCarHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCarRentingHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/cars/rentings', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch car renting history');
                }

                const data = await response.json();
                setCarHistories(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCarRentingHistory();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="car-renting-history-container">
            <h1 className="car-renting-history-title">Historia wypożyczeń</h1>
            {carHistories.map(car => (
                <div key={car.id} className="car-history">
                <Link to={`/cars/${car.id}`} className="car-link">
                            {car.manufacturer} {car.model} ({car.year})
                        </Link>                    <ul className="car-history-list">
                        {car.rentings.map(renting => (
                            <li key={renting.id} className="car-history-item">
                                <Link to={`/rentings/${renting.id}`} className="renting-link">
                            
                        
                                <p><strong>Start Date:</strong> {renting.startDate}</p>
                                <p><strong>End Date:</strong> {renting.endDate}</p>
                                <p><strong>Status:</strong> {renting.status}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default CarRentingHistory;
