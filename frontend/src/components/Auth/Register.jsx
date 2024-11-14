import React, { useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // default role to avoid empty value
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/user/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Registration successful');
    } catch (error) {
      alert('Error registering');
      console.log('Registering error', error);
    }
  };

  return (
    <div className="bg-zinc-900 w-screen h-screen text-white p-2 flex flex-col justify-center items-center gap-2">
      <p className="text-3xl">WELCOME</p>
      <p className="text-xl">Register Now!</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 border-2 border-zinc-700 p-3 bg-zinc-800 rounded-lg shadow-lg shadow-zinc-900 lg:w-1/4 md:w-2/4 w-3/4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="text-white bg-zinc-700 p-2 rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="text-white bg-zinc-700 p-2 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="text-white bg-zinc-700 p-2 rounded-md"
        />
        <select
          name="role"
          onChange={handleChange}
          className="text-white bg-zinc-700 p-2 rounded-md"
          value={formData.role}
        >
          <option value="user">User</option>
          <option value="staff">Staff</option>
        </select>
        <button type="submit" className="bg-green-600 py-1 text-lg rounded-md">
          Register
        </button>
        <button type="submit" className="bg-blue-600 py-1 text-lg rounded-md">
          Login
        </button>
        <p className="text-sm text-center">
          Having an account?{' '}
          <Link to="/login" className="text-green-600 font-semibold">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
