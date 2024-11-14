import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='bg-zinc-950'>
      <p>Demo</p>
      <p className=''>Login</p>
      <Link to="/login"><button>login</button></Link>
      <p>new user</p>
      <Link to="/register"><button>Create an account</button></Link>
    </div>
  )
}

export default Home