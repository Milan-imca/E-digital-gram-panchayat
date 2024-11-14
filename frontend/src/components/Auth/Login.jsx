import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Updated import
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // Updated hook

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/login', formData);
      console.log("Login Response:", res.data); // Log the response to inspect

      // Store the token and user details
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // Save user data

      toast('Login successful');

      // Redirect based on user role
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin-dashboard');
      else if (role === 'staff') navigate('/staff-dashboard');
      else navigate('/user-dashboard');
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      alert('Error logging in');
    }
  };

  return (
    <div className='bg-zinc-900 w-screen h-screen text-white p-2 flex flex-col justify-center items-center gap-2'>
      
      <p className='text-3xl'>WELCOME</p>
      <p className='text-xl'>Login</p>

      <form onSubmit={handleSubmit} className='flex flex-col gap-2 border-2 border-zinc-700 p-3 bg-zinc-800 rounded-lg shadow-lg shadow-zinc-900'>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className='text-white bg-zinc-700 p-2 rounded-md' />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className='text-white bg-zinc-700 p-2 rounded-md' />
        <button type="submit" className='bg-blue-600 py-1 text-lg rounded-md'>Login</button>
        <p className='text-sm'>New here? Create an account <Link to="/register" className='text-green-600 font-semibold'>Register Now</Link></p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
