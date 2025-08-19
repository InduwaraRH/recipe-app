import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Recipe App</Link>
        <nav className="flex items-center gap-4">
          {user && (
            <>
              <Link className={pathname==='/dashboard'?'font-semibold':''} to="/dashboard">Dashboard</Link>
              <Link className={pathname==='/favorites'?'font-semibold':''} to="/favorites">Favorites</Link>
              <button onClick={logout} className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">Logout</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
