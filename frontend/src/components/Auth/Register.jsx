import React, { useState } from 'react';
import api from '../../services/api';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // default role to avoid empty value
  });
  const navigate = useNavigate(); // Initialize the navigate hook

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
      toast.success('Registration successful! Please login.', {
        position: "top-center",
        autoClose: 1000, // auto-close after 2 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login'); // Redirects after a short delay
      }, 1500); // Delay of 2.5 seconds to allow the toast to finish
    } catch (error) {
      toast.error('Error registering. Please try again.', {
        position: "top-center",
        autoClose: 3000, // auto-close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      console.error('Registering error:', error);
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
        <p className="text-sm text-center">
          Having an account?{' '}
          <Link to="/login" className="text-green-600 font-semibold">
            Login here
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
