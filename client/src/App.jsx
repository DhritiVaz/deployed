import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import ApplicationNew from './pages/ApplicationNew'
import ApplicationDetail from './pages/ApplicationDetail'
import ApplicationEdit from './pages/ApplicationEdit'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/applications', element: <Applications /> },
          { path: '/applications/new', element: <ApplicationNew /> },
          { path: '/applications/:id', element: <ApplicationDetail /> },
          { path: '/applications/:id/edit', element: <ApplicationEdit /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
