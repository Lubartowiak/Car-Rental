import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CarList.css';

function CarList() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/cars', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cars');
                }

                const data = await response.json();
                setCars(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/cars/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            setCars(cars.filter(car => car.id !== id));
            alert('Samochód został usunięty');
        } catch (error) {
            console.error('Błąd podczas usuwania samochodu:', error);
            alert('Wystąpił błąd podczas usuwania samochodu');
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
            <h1 className="listasam">Lista Samochodów</h1>
            <Link to="/car-add">
                <button className="primary-button">Dodaj Nowy Samochód</button>
            </Link>
            <ul>
                {cars.map(car => (
                    <li key={car.id}>
                        <Link to={`/cars/${car.id}`} className="car-link">
                            {car.manufacturer} {car.model} ({car.year})
                        </Link>
                        <div className="button-group">
                            <Link to={`/car-edit/${car.id}`}>
                                <button className="primary-button">Edytuj</button>
                            </Link>
                            <button onClick={() => handleDelete(car.id)} className="delete-button">Usuń</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CarList;
