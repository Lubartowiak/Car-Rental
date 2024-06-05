import React, { useState } from 'react';
import './CarAddForm.css';

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

function CarAddForm() {
    const [manufacturer, setManufacturer] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [volume, setVolume] = useState(0);
    const [fuel, setFuel] = useState(FuelType.Gasoline);
    const [body, setBody] = useState(BodyType.Hatchback);

    const handleSubmit = async e => {
        e.preventDefault();

        // Walidacja
        if (volume <= 0.1) {
            alert('Pojemność silnika musi być większa niż 0.1');
            return;
        }

        if (year > 2024) {
            alert('Rok nie może być większy niż 2024');
            return;
        }

        const newCar = {
            "manufacturer": manufacturer,
            "model": model,
            "volume": Number(volume),
            "year": year,
            "fuel": fuel,
            "body": body
        };
        const token = localStorage.getItem('token');
        console.log('Token used for fetch:', token);

        try {
            const response = await fetch('http://localhost:3000/cars', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newCar)
            });

            if (!response.ok) {
                const error = await response.json();
                console.log(error);
                throw new Error(error.message);
            }

            const data = await response.json();
            console.log('Dodano nowy samochód:', data);
            alert('Nowy samochód został dodany');
            setManufacturer('');
            setModel('');
            setYear('');
            setVolume(0);
            setFuel(FuelType.Gasoline);
            setBody(BodyType.Hatchback);
        } catch (error) {
            console.error('Błąd podczas dodawania samochodu:', error);
            alert('Wystąpił błąd podczas dodawania samochodu');
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Dodaj Nowy Samochód</h1>
            <form onSubmit={handleSubmit} className="car-form">
                <div className="input-group">
                    <label htmlFor="manufacturer">Marka</label>
                    <input
                        type="text"
                        name="manufacturer"
                        value={manufacturer}
                        onChange={e => setManufacturer(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="model">Model</label>
                    <input
                        type="text"
                        name="model"
                        value={model}
                        onChange={e => setModel(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="year">Rok</label>
                    <input
                        type="number"
                        name="year"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="volume">Silnik (pojemność)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="volume"
                        value={volume}
                        onChange={e => setVolume(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="fuel">Rodzaj paliwa</label>
                    <select
                        name="fuel"
                        value={fuel}
                        onChange={e => setFuel(e.target.value)}
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
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        required
                    >
                        {Object.values(BodyType).map(bodyType => (
                            <option key={bodyType} value={bodyType}>
                                {bodyType}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="primary" type="submit">Dodaj Samochód</button>
            </form>
        </div>
    );
}

export default CarAddForm;
