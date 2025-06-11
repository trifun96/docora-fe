import React, { useState, useEffect } from 'react';
import Header from '../../../users/components/Header/Header';
import { registerUser } from '../../../api/api';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    ordinacija: '',
    adresa: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  try {
    const result = await registerUser(formData);
    setMessage('Uspešna registracija!');
    setFormData({
      name: '',
      email: '',
      password: '',
      ordinacija: '',
      adresa: '',
    });
  } catch (err) {
    setError(err.message || 'Došlo je do greške');
  }
};

  return (
    <>
    <Header/>
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Registracija korisnika</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ime i prezime:</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Šifra:</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <div>
          <label>Ordinacija:</label><br />
          <input
            type="text"
            name="ordinacija"
            value={formData.ordinacija}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Adresa:</label><br />
          <input
            type="text"
            name="adresa"
            value={formData.adresa}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          Registruj korisnika
        </button>
      </form>
    </div>
    </>
  );
}
