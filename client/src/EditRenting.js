import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CarList.css';
import './EditRenting.css';

function EditRenting() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [renting, setRenting] = useState(null);
    const [cars, setCars] = useState([]);
    const [formValues, setFormValues] = useState({
        carId: '',
        startDate: '',
        endDate: '',
        status: ''
    });
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
                setFormValues({
                    carId: data.car.id,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    status: data.status
                });
            } catch (error) {
                setError(error.message);
            }
        };

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
            }
        };

        fetchRenting();
        fetchCars();
        setLoading(false);
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/rentings/${id}`, {
                method: 'PUT',
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
                console.error(error);
                throw new Error(error.message);
            }

            await response.json();

            navigate('/rentings');
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2 className="edytwyp">Edytuj Wypożyczenie</h2>
            <form onSubmit={handleSaveEdit}>
                <div className="input-group">
                    <label htmlFor="carId">Samochód</label>
                    <select
                        name="carId"
                        value={formValues.carId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Wybierz samochód</option>
                        {renting && (
                            <option value={renting.car.id}>
                                {renting.car.manufacturer} {renting.car.model} (Aktualnie wypożyczony)
                            </option>
                        )}
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
                <div className="input-group">
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
                </div>
                <button type="submit" className="primary">Zapisz</button>
                <button type="button" onClick={() => navigate('/rentings')} className="secondary8">Anuluj</button>
            </form>
        </div>
    );
}

export default EditRenting;
