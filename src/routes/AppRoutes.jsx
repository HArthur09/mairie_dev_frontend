import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import MariageList from '../pages/MariageList'
import MariageDetail from '../pages/MariageDetail'
import MariageCreate from '../pages/mariages/MariageCreate'
import PrivateRoute from '../auth/PrivateRoute'
import MariageEdit from '../pages/MariageEdit'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/mariages"
        element={
          <PrivateRoute>
            <MariageList />
          </PrivateRoute>
        }
      />

      <Route
        path="/mariages/:id"
        element={
          <PrivateRoute>
            <MariageDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/mariages/create"
        element={
          <PrivateRoute>
            <MariageCreate />
          </PrivateRoute>
        }
      />
      <Route 
        path="/mariages/:id/edit" 
        element={
          <PrivateRoute>
            <MariageEdit />
          </PrivateRoute>
        } 
      />


      <Route path="/" element={<Navigate to="/mariages" replace />} />
    </Routes>
  )
}
