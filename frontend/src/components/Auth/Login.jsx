import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/login', formData);
      console.log("Login Response:", res.data);

      // Store the token and user details
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Show success toast
      toast.success('Login successful!', {
        position: "top-center",
        autoClose: 1000, // Toast auto-close after 2 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      // Redirect after a brief delay to ensure toast is visible
      setTimeout(() => {
        const role = res.data.user.role;
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'staff') navigate('/staff-dashboard');
        else navigate('/user-dashboard');
      }, 1000); // 2-second delay to match toast duration
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      toast.error('Error logging in. Please check your credentials.', {
        theme: "dark",
      });
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
