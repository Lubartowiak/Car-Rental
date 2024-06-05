import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        const emailRegex = /^\S+@\S+\.\S+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        console.log("123:", username);
        
        if (!email) {
            alert("Email wymagany");
        } else if(username.trim().length===0){
            alert("Nazwa użytkownika nie może zawierać samych spacji");
        }else if (!emailRegex.test(email)) {
            alert("Wymagany prawidłowy email");
        } else if (!password) {
            alert("Hasło wymagane");
        } else if (!passwordRegex.test(password)) {
            alert("Hasło musi zawierać co najmniej 8 znaków, w tym jedną dużą literę, jedną małą literę, jedną cyfrę i jeden znak specjalny");
        } else {
            try {
                let response = await fetch('http://localhost:3000/auth/register', {
                    method: "POST",
                    headers: {
                        "content-type": 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password,
                    })
                });
                const data = await response.json();
                console.log(data);
                alert('Rejestracja zakończona sukcesem');
                setEmail('');
                setPassword('');
                navigate('/');
            } catch (error) {
                console.error('Błąd rejestracji:', error.response ? error.response.data.message : error.message);
                alert('Błąd rejestracji: ' + (error.response ? error.response.data.message : error.message));
            }
        }
    };

    return (
        <div>
            <h1>Rejestracja</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Nazwa użytkownika</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="name@example.com"
                        required 
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Hasło</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button className="primary" type="submit">Zarejestruj się</button>
            </form>
            <Link to="/">
                <button className="secondary">Wróć do logowania</button>
            </Link>
        </div>
    );
}

export default Register;
