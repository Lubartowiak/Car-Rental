// CarEditForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CarEditForm.css';

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

const IsAvailable = {
    True: "Tak",
    False: "Nie",
};

function CarEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        manufacturer: '',
        model: '',
        volume: 0,
        year: '',
        fuel: FuelType.Gasoline,
        body: BodyType.Hatchback,
        available: IsAvailable.True,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/cars/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch car details');
                }

                const data = await response.json();
                setFormValues({
                    manufacturer: data.manufacturer,
                    model: data.model,
                    volume: data.volume,
                    year: data.year,
                    fuel: data.fuel,
                    body: data.body,
                    available: data.available ? IsAvailable.True : IsAvailable.False,
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleSaveEdit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/cars/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    manufacturer: formValues.manufacturer,
                    model: formValues.model,
                    volume: Number(formValues.volume),
                    year: formValues.year,
                    fuel: formValues.fuel,
                    body: formValues.body,
                    available: formValues.available === IsAvailable.True,
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            alert('Samochód został zaktualizowany');
            navigate('/car-list');
        } catch (error) {
            console.error('Błąd podczas aktualizacji samochodu:', error);
            alert('Wystąpił błąd podczas aktualizacji samochodu');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="form-container">
            <h1 className="form-title">Edytuj Samochód</h1>
            <form onSubmit={handleSaveEdit} className="car-form">
                <div className="input-group">
                    <label htmlFor="manufacturer">Marka</label>
                    <input
                        type="text"
                        name="manufacturer"
                        value={formValues.manufacturer}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="model">Model</label>
                    <input
                        type="text"
                        name="model"
                        value={formValues.model}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="volume">Silnik (pojemność)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="volume"
                        value={formValues.volume}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="year">Rok</label>
                    <input
                        type="number"
                        name="year"
                        value={formValues.year}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="fuel">Rodzaj paliwa</label>
                    <select
                        name="fuel"
                        value={formValues.fuel}
                        onChange={handleInputChange}
                        required
                    >
                        {Object.values(FuelType).map(fuelType => (
                            <option key={fuelType} value={fuelType}>
                                {fuelType}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="body">Typ nadwozia</label>
                    <select
                        name="body"
                        value={formValues.body}
                        onChange={handleInputChange}
                        required
                    >
                        {Object.values(BodyType).map(bodyType => (
                            <option key={bodyType} value={bodyType}>
                                {bodyType}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="available">Czy dostępny?</label>
                    <select
                        name="available"
                        value={formValues.available}
                        onChange={handleInputChange}
                        required
                    >
                        {Object.values(IsAvailable).map(isavailable => (
                            <option key={isavailable} value={isavailable}>
                                {isavailable}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="primary">Zapisz</button>
                <button type="button" className="secondary1" onClick={() => navigate('/car-list')}>Anuluj</button>
            </form>
        </div>
    );
}

export default CarEditForm;
