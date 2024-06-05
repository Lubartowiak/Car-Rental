import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddRentingForm.css';

function AddRentingForm() {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [formValues, setFormValues] = useState({
        carId: '',
        startDate: '',
        endDate: '',
        status: 'active'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/cars/available', {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleAddRenting = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/rentings', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    carId: Number(formValues.carId),
                    startDate: formValues.startDate,
                    endDate: formValues.endDate,
                    status: formValues.status
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            alert('Wypożyczenie zostało dodane');
            navigate('/rentings');
        } catch (error) {
            alert('Błąd dodawania wypożyczenia: ' + error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="add-renting-container">
            <h2 className="dodnow">Dodaj Nowe Wypożyczenie</h2>
            <form onSubmit={handleAddRenting}>
                <div className="input-group">
                    <label htmlFor="carId">Samochód</label>
                    <select
                        name="carId"
                        value={formValues.carId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Wybierz samochód</option>
                        {cars.map(car => (
                            <option key={car.id} value={car.id}>
                                {car.manufacturer} {car.model}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="startDate">Data rozpoczęcia</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formValues.startDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="endDate">Data zakończenia</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formValues.endDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {/* <div className="input-group">
                    <label htmlFor="status">Status</label>
                    <select
                        name="status"
                        value={formValues.status}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="active">Aktywne</option>
                        <option value="returned">Zwrócone</option>
                    </select>
                </div> */}
                <button type="submit" className="primary">Dodaj</button>
                <button type="button" onClick={() => navigate('/rentings')} className="secondary6">Anuluj</button>
            </form>
        </div>
    );
}

export default AddRentingForm;
