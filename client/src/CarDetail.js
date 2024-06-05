import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CarDetail.css';

const BodyType = {
    Hatchback: "Hatchback",
    Sedan: "Sedan",
    Kombi: "Kombi",
    SUV: "SUV",
    Coupe: "Coupe"
};

const FuelType = {
    Gasoline: "Gasoline",
    Diesel: "Diesel",
    Electric: "Electric",
    Hybrid: "Hybrid"
};

function CarDetail() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log(id);
                const response = await fetch(`http://localhost:3000/cars/${Number(id)}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch car');
                }

                const data = await response.json();
                console.log(data);
                setCar(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!car) {
        return <div>Car not found</div>;
    }

    return (
        <div className="car-detail-container">
            <h1 className="car-detail-title">Car Details</h1>
            <div className="car-detail-content">
                <p><strong>Manufacturer:</strong> {car.manufacturer}</p>
                <p><strong>Model:</strong> {car.model}</p>
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Volume:</strong> {car.volume}</p>
                <p><strong>Fuel:</strong> {FuelType[car.fuel]}</p>
                <p><strong>Body:</strong> {BodyType[car.body]}</p>
            </div>
        </div>
    );
}

export default CarDetail;
