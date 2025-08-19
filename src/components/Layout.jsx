import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
      <footer className="text-center py-6 text-xs text-gray-500">
        Made with React, Framer Motion, and TheMealDB 🍽️
      </footer>
    </div>
  )
}
