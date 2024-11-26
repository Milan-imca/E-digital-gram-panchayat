import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts
    try {
      const res = await api.post('/user/login', formData);
      console.log("Login Response:", res.data);

      // Store the token and user details
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Show success toast
      toast.success('Login successful!', {
        position: "top-center",
        autoClose: 1000,
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
      }, 1000);
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      toast.error('Error logging in. Please check your credentials.', {
        theme: "dark",
      });
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <div className='bg-zinc-900 w-screen h-screen text-white p-2 flex flex-col justify-center items-center gap-2'>
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="loader border-t-4 border-b-4 border-white rounded-full w-12 h-12 animate-spin"></div>
          <p className="text-lg">Logging in...</p>
        </div>
      ) : (
        <>
          <p className='text-3xl'>WELCOME</p>
          <p className='text-xl'>Login</p>
          <form onSubmit={handleSubmit} className='flex flex-col gap-2 border-2 border-zinc-700 p-3 bg-zinc-800 rounded-lg shadow-lg shadow-zinc-900'>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className='text-white bg-zinc-700 p-2 rounded-md'
              disabled={loading} // Disable input during loading
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className='text-white bg-zinc-700 p-2 rounded-md'
              disabled={loading} // Disable input during loading
            />
            <button
              type="submit"
              className='bg-blue-600 py-1 text-lg rounded-md'
              disabled={loading} // Disable button during loading
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className='text-sm'>
              New here? Create an account{' '}
              <Link to="/register" className='text-green-600 font-semibold'>Register Now</Link>
            </p>
          </form>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default Login;
