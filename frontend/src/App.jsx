import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Leads from './pages/Leads'
import Tasks from './pages/Tasks'

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token')
    return token ? children : <Navigate to="/login" />
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
                <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
                <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App