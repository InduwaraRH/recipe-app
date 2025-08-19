import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="p-6">Loading…</div>
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <Outlet />
}
