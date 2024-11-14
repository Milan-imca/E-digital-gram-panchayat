import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Updated import

const Navbar = () => {
  const navigate = useNavigate(); // Updated hook

  // Get the user role and token from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Also remove user info
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className='bg-zinc-950 text-white display flex justify-between items-center p-4'>
      <div>
        {/* Home Link */}
        <Link to="/" className='text-xl'>
          SevaGram
        </Link>
      </div>

      <div className='flex gap-2'>
        {/* If the user is not logged in, show login and register links */}
        {!token ? (
          <>
            <Link to="/login" className='bg-blue-600 px-3 py-2 rounded-md' >
              Login
            </Link>
            <Link to="/register" className='bg-green-600 px-3 py-2 rounded-md'>
              Register
            </Link>
          </>
        ) : (
          // If the user is logged in, show the relevant dashboard links based on role
          <div className='flex items-center gap-2'>
            {user?.role === 'user' && (
              <Link to="/user-dashboard" >
                User Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin-dashboard" >
                Admin Dashboard
              </Link>
            )}
            {user?.role === 'staff' && (
              <Link to="/staff-dashboard" >
                Staff Dashboard
              </Link>
            )}
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className='bg-red-600 px-2 py-1 rounded-md'

            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
