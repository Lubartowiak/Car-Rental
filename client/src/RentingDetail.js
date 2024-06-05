import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RentingDetail.css';

function RentingDetail() {
    const { id } = useParams();
    const [renting, setRenting] = useState(null);
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRenting = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/rentings/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch renting details');
                }

                const data = await response.json();
                setRenting(data);

                const carResponse = await fetch(`http://localhost:3000/cars/${data.car.id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!carResponse.ok) {
                    throw new Error('Failed to fetch car details');
                }

                const carData = await carResponse.json();
                setCar(carData);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRenting();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="renting-detail-container">
            <h1 className="renting-detail-title">Renting Details</h1>
            {renting && (
                <div className="renting-detail-content">
                    <p><strong>Start Date:</strong> {renting.startDate}</p>
                    <p><strong>End Date:</strong> {renting.endDate}</p>
                    <p><strong>Status:</strong> {renting.status}</p>
                </div>
            )}
            {car && (
                <div className="car-detail-content">
                    <h2>Car Details</h2>
                    <p><strong>Manufacturer:</strong> {car.manufacturer}</p>
                    <p><strong>Model:</strong> {car.model}</p>
                </div>
            )}
        </div>
    );
}

export default RentingDetail;
