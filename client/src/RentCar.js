import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RentCar.css';

function RentCar() {
    const [rentings, setRentings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRentings = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/rentings', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch rentings');
                }

                const data = await response.json();
                setRentings(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRentings();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/rentings/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                console.error(error);
                throw new Error(error.message);
            }

            setRentings(rentings.filter(renting => renting.id !== id));
            alert('Wypożyczenie zostało usunięte');
        } catch (error) {
            console.error('Błąd podczas usuwania wypożyczenia:', error);
            alert('Wystąpił błąd podczas usuwania wypożyczenia');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h1 className="listawyp">Lista Wypożyczeń</h1>
            <button onClick={() => navigate('/rentings/new')} className="primary-button">Dodaj Nowe Wypożyczenie</button>
            <ul>
                {rentings.map(renting => (
                    <li key={renting.id}>
                        <Link to={`/rentings/${renting.id}`} className="renting-link">
                            {renting.startDate} - {renting.endDate} ({renting.status})
                        </Link>
                        <div className="button-group">
                            <button onClick={() => navigate(`/rentings/edit/${renting.id}`)} className="primary-button">Edytuj</button>
                            <button onClick={() => handleDelete(renting.id)} className="delete-button">Usuń</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RentCar;
